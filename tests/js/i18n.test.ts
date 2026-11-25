import { readFileSync, readdirSync } from "node:fs";
import { test, expect } from "vitest";
import { setLang, t, type MessageKey } from "../../resources/js/i18n";

const read = (dir: string, type: RegExp) =>
  readdirSync(dir, { recursive: true, encoding: "utf8" })
    .filter((f) => type.test(f))
    .map((f) => readFileSync(`${dir}/${f}`, "utf8"))
    .join("\n");

const front = read("resources/js", /\.(vue|ts)$/);
// t("key") calls, link labels and title keys; error codes come from the PHP side
const keys = new Set([
  ...[...front.matchAll(/\bt\("(\w+)"\)|label: "([a-z]\w*)" }|^  [A-Z]\w+: "(\w+)",\r?$/gm)].map((m) => m[1] || m[2] || m[3]),
  ...[...read("app", /\.php$/).matchAll(/'(required|tooLong|tooMany|loginError|taken|bad[A-Z]\w*)'(?!\s*=>)/g)].map((m) => m[1]),
  ..."required badFrom badTo".split(" "),
]);

test.each(["hu", "en"] as const)("every key used has a %s text", (lang) => {
  setLang(lang);
  expect(keys.has("taken")).toBe(true);
  expect([...keys].filter((key) => t(key as MessageKey) === key && !["admin"].includes(key))).toEqual([]);
  setLang("hu");
});
