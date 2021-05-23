import pkg from "./package.json";
import { RollupWatchOptions } from "rollup";
import dts from "rollup-plugin-dts";

const config: Array<RollupWatchOptions> = [
  {
    input: "./build/src/index.js",
    output: [
      { file: pkg.exports.import, format: "es" },
      { file: pkg.exports.require, format: "commonjs", exports: "named" },
    ],
    external: [
      "path",
      "fs",
      "request",
      "typescript",
      "rollup",
      "rollup-plugin-dts",
      "chalk",
    ],
  },
  {
    input: "./build/src/index.d.ts",
    output: [{ file: pkg.exports.types, format: "es" }],
    plugins: [dts()],
  },
];

export default config;
