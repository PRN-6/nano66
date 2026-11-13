import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      include: ["src/**/*"],
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "Nano66",
      formats: ["es", "cjs"],
      fileName: (format) => `nano66.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      // Don't bundle heavy peer/externals if desired, but for ease of use in vanilla websites or standalone bundles,
      // let's check what's expected: "npm install nano66".
      // Pixi and GSAP are listed in dependencies. In typical library builds, pixi.js and gsap can be bundled or externalized.
      // Bundling or externalizing: When people install via npm, bundlers resolve dependencies.
      // If we externalize pixi.js and gsap, bundlers like Vite/Webpack will bundle them in the consuming app.
      // Let's externalize them in rollupOptions so nano66 is clean and doesn't duplicate them if already present,
      // or should we keep external? Yes, externalizing dependencies: ["pixi.js", "gsap"] is standard for npm libraries.
      external: ["pixi.js", "gsap"],
      output: {
        exports: "named",
        globals: {
          "pixi.js": "PIXI",
          gsap: "gsap",
        },
      },
    },
    sourcemap: true,
    minify: false,
  },
  test: {
    globals: true,
    environment: "happy-dom",
    include: ["tests/**/*.test.ts"],
  },
});
