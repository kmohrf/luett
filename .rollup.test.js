import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: 'test.js',
  dest: 'dist/luett.test.js',
  format: "umd",
  moduleName: require('./package.json').name,
  plugins: [
    json(),
    babel({
      exclude: 'node_modules/**',
      plugins: ['external-helpers'],
      runtimeHelpers: true
    }),
    resolve({
      jsnext: true,
      main: true,
    }),
    commonjs({
      include: 'node_modules/**',
    })
  ],
}
