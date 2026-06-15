// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

const isProd = process.env.NODE_ENV === "production";

// https://astro.build/config
export default defineConfig({
  site: "https://kamutwo.github.io",
  base: isProd ? "/multiplication" : "/",
  vite: {
      plugins: [tailwindcss()],
  },

  integrations: [react()],
});