import remove from "@omnihash/rollup-plugin-remove-files";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import copy from "rollup-plugin-copy";
import { default as dts } from "rollup-plugin-dts";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";

const packageJson = require("./package.json");
export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      terser(),
      postcss({
        extract: true,
        minimize: true,
        modules: false,
        use: ["sass"],
      }),
    ],
    external: ["react", "react-dom"],
  },
  {
    input: "src/index.ts",
    output: [{ file: "dist/types.d.ts", format: "es" }],
    plugins: [
      copy({
        targets: [{ src: "dist/cjs/index.css", dest: "dist/" }],
        // verbose: true,
        hook: "buildStart",
      }),
      remove({
        filePaths: ["dist/esm/index.css", "dist/cjs/index.css"],
      }),
      dts.default(),
    ],
    external: [/\.css$/, /\.scss$/],
  },
];
