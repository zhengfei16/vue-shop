var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

var env = config.build.env

var webpackConfig = merge(baseWebpackConfig, {
	output: {
		// path: config.build.assetsRoot,
		filename: 'build.[hash:16].js',
		chunkFilename: '[name].[hash:16].js',
		// publicPath: config.build.assetsCdnPublicPath,

	},
	module: {
		rules: utils.styleLoaders({
			sourceMap: config.build.productionSourceMap,
			extract: true
		}).concat([
			{
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1000, //图片尽量走url
          name: utils.assetsPath('[path][name].[ext]'),
          publicPath: config.build.assetsCdnPublicPath+"/",
          emitFile: false
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1000, //图片尽量走url
          name: utils.assetsPath('[path][name].[ext]'),
          publicPath: config.build.assetsCdnPublicPath,
          emitFile: false
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
           limit: 1000, //图片尽量走url
          name: utils.assetsPath('[path][name].[ext]'),
          publicPath: config.build.assetsCdnPublicPath,
          emitFile: false
        }
      }
		])
	},
	externals: {
		'vue': 'Vue'
	},
	devtool: '#source-map',
	plugins: [
		// http://vuejs.github.io/vue-loader/en/workflow/production.html
		new webpack.DefinePlugin({
			'process.env': env
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			},
			sourceMap: true
		}),
		// extract css into its own file
		new ExtractTextPlugin({
			// filename: utils.assetsPath('css/[name].css')
			filename: '[name].[contenthash:16].css'
		}),
		// Compress extracted CSS. We are using this plugin so that possible
		// duplicated CSS from different components can be deduped.
		new OptimizeCSSPlugin({
			cssProcessorOptions: {
				safe: true
			}
		}),
		// extract webpack runtime and module manifest to its own file in order to
		// prevent vendor hash from being updated whenever app bundle is updated
		// new webpack.optimize.CommonsChunkPlugin({
		//   name: 'manifest',
		//   chunks: ['vendor']
		// }),
		// copy custom static assets
	]
})

module.exports = webpackConfig
