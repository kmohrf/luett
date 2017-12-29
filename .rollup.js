import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'

export default {
  input: 'src/main.js',
  output: {
    name: require('./package.json').name,
    file: 'dist/luett.js',
    format: 'umd',
  },
  plugins: [ json(), babel() ]
}
