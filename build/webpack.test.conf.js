// This is the webpack config used for unit tests.

var utils = require('./utils')
var webpack = require('webpack')
var merge = require('webpack-merge')
var baseConfig = require('./webpack.base.conf')

var webpackConfig = merge(baseConfig, {
	// use inline sourcemap for karma-sourcemap-loader
	module: {
		rules: utils.styleLoaders().concat([
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 1,
					name: utils.assetsPath('img/[name].[hash:7].[ext]')
				}
			},
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('media/[name].[hash:7].[ext]')
				}
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
				}
			}
		])
	},
	devtool: '#inline-source-map',
	resolveLoader: {
		alias: {
			// necessary to to make lang="scss" work in test when using vue-loader's ?inject option 
			// see discussion at https://github.com/vuejs/vue-loader/issues/724
			'scss-loader': 'sass-loader'
		}
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': require('../config/test.env')
		})
	]
})

// no need for app entry during tests
delete webpackConfig.entry

module.exports = webpackConfig
