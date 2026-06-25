import { defineConfig } from "vite";
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "solid",
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
      disableTypes: false,
      routeTreeFileHeader: [
        "/* eslint-disable */",
        "// noinspection JSUnusedGlobalSymbols",
      ],
      autoCodeSplitting: true,
    }),
    paraglideVitePlugin({
      project: "../../project.inlang",
      outdir: "../../packages/core/src/paraglide",
      emitGitIgnore: false,
      emitPrettierIgnore: false,
      emitTsDeclarations: true,
      outputStructure: "locale-modules",
      strategy: ["globalVariable", "localStorage", "baseLocale"],
    }),
    solid(),
  ],
  server: {
    host: true,
  },
});
