import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import { uglify as uglifyJS } from 'rollup-plugin-uglify'
import { terser } from 'rollup-plugin-terser'
import gzip from 'rollup-plugin-gzip'

const configs = []

for (const format of ['umd', 'cjs', 'amd', 'esm']) {
  configs.push(createConfig(format))
}

export default configs

// --- locals -------------------------------------------------------

function createConfig(moduleFormat) {
  return {
    input: 'src/main.ts',

    output: {
      file: `dist/js-messages.${moduleFormat}.js`,
      format: moduleFormat,
      name: 'jsMessages'
    },

    plugins: [
      resolve(),
      commonjs(),
      typescript({
        exclude: 'node_modules/**'
      }),
      moduleFormat === 'esm' ? terser() : uglifyJS(),
      gzip()
    ]
  }
}
