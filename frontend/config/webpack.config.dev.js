const path = require('path')
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
var InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
var WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
var getClientEnvironment = require('./env');
var paths = require('./paths');
var publicPath = '/';
var publicUrl = '';
var env = getClientEnvironment(publicUrl);

/* Hot module reloading for PostCSS defined variables! */
const postcssConfigFile = require.resolve("./postcss.config.js")
const postcssConfig = (webpackInstance) => {
  const varFile = require.resolve("../src/config.js")
  const varFileContents = () => {
    webpackInstance.addDependency(varFile)
    delete require.cache[varFile]
    return require(varFile)()
  }
  webpackInstance.addDependency(postcssConfigFile)
  delete require.cache[postcssConfigFile]
  return require(postcssConfigFile)(varFileContents())
}
/* End Hot module reloading for PostCSS defined variables! */

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: [
    require.resolve('react-dev-utils/webpackHotDevClient'),
    require.resolve('./polyfills'),
    paths.appIndexJs
  ],
  output: {
    path: paths.appBuild,
    pathinfo: true,
    filename: 'static/js/bundle.js',
    publicPath: publicPath
  },
  resolve: {
    fallback: paths.nodePaths,
    root: path.resolve(__dirname),
    extensions: ['.js', '.json', '.jsx', ''],
    alias: {
      'react-native': 'react-native-web',
    },
  },

  module: {
    preLoaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'eslint',
        include: paths.appSrc,
      }
    ],
    loaders: [
      {
        exclude: [
          /\.html$/,
          /\.(js|jsx)$/,
          /\.css$/,
          /\.json$/,
          /\.svg$/
        ],
        loader: 'url',
        query: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]'
        }
      },
      // Process JS with Babel.
      {
        test: /\.(js|jsx)$/,
        include: paths.appSrc,
        loader: 'babel',
        query: {
          cacheDirectory: true
        }
      },
      {
        test: /@serverless\/ui-components.*.css$/,
        loaders: ['style-loader', 'css-loader'],
      },
      {
        // *.global.css => global (normal) css
        test: /\.global\.css$/,
        include: paths.appSrc,
        loaders: ['style-loader', 'css-loader'],
      },
      {
        test: /\.css$/,
        include: paths.appSrc,
        loader: 'style!css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]&camelCase!postcss'
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.svg$/,
        loader: 'file',
        query: {
          name: 'static/media/[name].[hash:8].[ext]'
        }
      }
    ]
  },
  postcss: postcssConfig,
  plugins: [
    new InterpolateHtmlPlugin({
      PUBLIC_URL: publicUrl
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
    }),
    new webpack.DefinePlugin(env),
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
    new WatchMissingNodeModulesPlugin(paths.appNodeModules)
  ],
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};
