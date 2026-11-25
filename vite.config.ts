import { defineConfig } from "vitest/config";
import laravel from "laravel-vite-plugin";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // the Laravel plugin is for serving and building, not for the unit tests
    !process.env.VITEST && laravel({ input: "resources/js/app.ts", refresh: true }),
    vue({ template: { transformAssetUrls: { base: null, includeAbsolute: false } } }),
    tailwindcss(),
  ],
  server: {
    watch: { ignored: ["**/storage/framework/views/**"] },
  },
  test: {
    environment: "jsdom",
    include: ["tests/js/**/*.test.ts"],
    setupFiles: ["tests/js/setup.ts"],
    coverage: { include: ["resources/js/**"], reporter: ["text", "html"] },
  },
});
