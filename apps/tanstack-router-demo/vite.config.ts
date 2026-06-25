import { defineConfig } from "vite";
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "solid",
      autoCodeSplitting: true,
    }),
    paraglideVitePlugin({
      project: "../../project.inlang",
      outdir: "../../packages/core/src/paraglide",
      emitGitIgnore: false,
      emitPrettierIgnore: false,
      emitTsDeclarations: true,
      strategy: ["globalVariable", "localStorage", "baseLocale"],
    }),
    solid(),
  ],
  server: {
    host: true,
  },
});
