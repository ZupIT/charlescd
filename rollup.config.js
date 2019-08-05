import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import { uglify } from 'rollup-plugin-uglify'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/spinnaker.js',
    format: 'cjs'
  },
  plugins: [
    json(),
    commonjs(),
    resolve({
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    }),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true
    }),
    uglify()
  ],
  external: ['@octokit/rest', '@babel/runtime/regenerator', 'lodash/map', '@babel/runtime/helpers/asyncToGenerator']
}
