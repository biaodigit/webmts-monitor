import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';
import sourceMaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

const createConfig = ({ output }) => {
    const plugins = [
        resolve(),
        typescript({
            exclude: 'node_modules/**',
            typescript: require('typescript')
        }),
        sourceMaps(),
        terser({
            output: {
                comments: function (node, comment) {
                    var text = comment.value;
                    var type = comment.type;
                    if (type == "comment2") {
                        // multiline comment
                        return /@preserve|@license|@cc_on/i.test(text);
                    }
                },
            },
        })
    ]

    if (output.format !== 'esm') plugins.unshift(commonjs())

    return {
        input: 'src/index.ts',
        output: {
            ...output,
            name: 'webmts-monitor',
            sourcemap: true
        },
        plugins
    }
}

export default [
    createConfig({
        output: {
            file: pkg.main,
            format: 'cjs'
        }
    }),
    createConfig({
        output: {
            file: pkg.module,
            format: 'esm'
        }
    }),
    createConfig({
        output: {
            file: pkg.browser,
            format: 'umd'
        }
    })
]