import { readFileSync } from "node:fs";
import { mount } from "@vue/test-utils";
import { test, expect } from "vitest";
import AppLayout from "../../resources/js/Layouts/AppLayout.vue";
import { loadTheme, setTheme } from "../../resources/js/preferences";

const css = readFileSync("resources/css/app.css", "utf8");

/* the colour tokens declared in the block that starts with this text */
const tokens = (start: string): Record<string, string> => {
  const at = css.indexOf(start);
  const block = css.slice(at, css.indexOf("}", at));
  return Object.fromEntries([...block.matchAll(/--color-([\w-]+): (#[0-9a-f]{6});/g)].map((m) => [m[1], m[2]]));
};

const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a: string, b: string) => {
  const [low, high] = [luminance(a), luminance(b)].sort((x, y) => x - y);
  return (high + 0.05) / (low + 0.05);
};

const dark = tokens("@theme {");
const themes = { dark, light: { ...dark, ...tokens(':root[data-theme="light"] {') } };

test.each(Object.entries(themes))("the %s theme meets WCAG AA contrast", (_, color) => {
  const failures: string[] = [];
  const need = (min: number, fore: string, back: string) => {
    const got = ratio(color[fore], color[back]);
    if (got < min) failures.push(`${fore} on ${back}: ${got.toFixed(2)} < ${min}`);
  };
  for (const ground of ["night", "deep", "raise"]) {
    // text
    for (const text of ["ink", "soft", "amber-ink", "alert"]) need(4.5, text, ground);
    // control borders and the booked-day slash
    need(3, "edge", ground);
  }
  // large text only: the dates in the admin list
  need(3, "cobalt", "night");
  need(4.5, "on-amber", "amber");
  need(4.5, "on-amber", "amber-lift");
  // the slash across a selected day that is booked
  need(3, "night", "alert");

  expect(failures).toEqual([]);
});

test("the stage keeps the dark palette in the light theme", () => {
  const stage = tokens(':root[data-theme="light"] .on-stage {');
  expect(Object.keys(stage).length).toBeGreaterThan(0);
  for (const [name, value] of Object.entries(stage)) expect([name, value]).toEqual([name, dark[name]]);
});

test("the header button switches the theme and remembers it", async () => {
  setTheme("dark");
  const button = mount(AppLayout, { global: { mocks: { $page: { url: "/", component: "", props: {} } } } }).find("[data-theme-toggle]");
  expect(button.attributes("aria-label")).toBe("Váltás világos témára");

  await button.trigger("click");
  expect(button.attributes("aria-label")).toBe("Váltás sötét témára");
  expect(document.documentElement.dataset.theme).toBe("light");
  expect(loadTheme()).toBe("light");

  await button.trigger("click");
  expect(document.documentElement.dataset.theme).toBe("dark");
  expect(loadTheme()).toBe("dark");
});

test("large text stays readable over a white patch at the top of a photo", () => {
  const stage = readFileSync("resources/js/components/CarStage.vue", "utf8");
  const alpha = Number(/to-dusk\/(\d+)/.exec(stage)![1]) / 100;
  // white after the photo's brightness(.82) and contrast(1.08)
  const photo = Math.round(((0.82 - 0.5) * 1.08 + 0.5) * 255);
  const mixed = [1, 3, 5]
    .map((i) => Math.round(photo * (1 - alpha) + parseInt(dark.dusk.slice(i, i + 2), 16) * alpha))
    .map((c) => c.toString(16).padStart(2, "0"));
  expect(ratio(dark.ink, "#" + mixed.join(""))).toBeGreaterThanOrEqual(3);
});

test("the browser bar colours written outside the CSS match the page ground", () => {
  for (const file of ["resources/views/app.blade.php", "resources/js/preferences.ts"]) {
    const source = readFileSync(file, "utf8");
    expect(source).toContain(themes.light.night);
  }
  expect(readFileSync("resources/views/app.blade.php", "utf8")).toContain(`content="${dark.night}"`);
});
