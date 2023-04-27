import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import minifyHTML from 'rollup-plugin-minify-html-literals';
import { terser } from "rollup-plugin-terser";


export default {
    input: "./src/index.ts",
    output: [
        {
            file: "./demo/js/master.js",
            format: "es",
            compact: true,
        },
    ],
    plugins: [
        resolve(),
        minifyHTML({
            options: {
                minifyOptions: {
                    // Prevent svg fragment in html to lose its closing slash
                    keepClosingSlash: true,
                }
            }
        }),
        typescript({
            declaration: false
        }),
        terser()
    ],
};
