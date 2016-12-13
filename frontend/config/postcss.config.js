var postCSSConfig = [
/* autoprefix for different browser vendors */
require('autoprefixer'),
/* reset inherited rules */
require('postcss-initial')({
  reset: 'inherited' // reset only inherited rules
}),
/* enable css @imports like Sass/Less */
require('postcss-import'),
/* enable nested css selectors like Sass/Less */
require('postcss-nested'),
/* require global variables */
// require('postcss-simple-vars')({
//   variables: function variables() {
//     return require('../src/variables')
//   },
//   unknown: function unknown(node, name, result) {
//     node.warn(result, 'Unknown variable ' + name)
//   }
// }),
/* PostCSS plugin for making calculations with math.js  */
require('postcss-math'),
/* transform W3C CSS color function to more compatible CSS. */
require('postcss-color-function')
]

// Export the PostCSS Config for usage in webpack
module.exports = postCSSConfig;