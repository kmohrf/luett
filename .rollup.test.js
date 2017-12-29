import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import builtIns from 'rollup-plugin-node-builtins'

export default {
  input: 'test.js',
  output: {
    name: require('./package.json').name,
    format: 'umd',
    file: 'dist/luett.test.js'
  },
  plugins: [
    resolve(),
    builtIns(),
    commonjs({
      include: 'node_modules/**'
    }),
    json(),
    babel({
      plugins: ['external-helpers']
    })
  ],
}
