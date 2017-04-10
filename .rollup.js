import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'

export default {
  entry: 'src/main.js',
  dest: 'dist/luett.js',
  format: 'umd',
  moduleName: require('./package.json').name,
  plugins: [ json(), babel() ]
}
