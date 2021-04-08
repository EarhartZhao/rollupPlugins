import rewriteOptions from "rollup-plugin-rewrite-options";
export default {
  // input: ['src/index.js', 'src/album.js'],
  input: {
    foo: 'src/index.js',
    bar: 'src/album.js'
  },
  output: {
    dir: 'dist',
    format: 'amd'
  },
  plugins: [
    rewriteOptions()
  ]
}
