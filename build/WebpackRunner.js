let fs = require('fs')
let rm = require('rimraf')
let path = require('path')
let chalk = require('chalk')
let webpack = require('webpack')
let HtmlWebpackPlugin = require('html-webpack-plugin')
const fsExtra = require('fs-extra')
const config = require('../config')
var merge = require('webpack-merge')

module.exports =
	class TaskRunner {
		/**
		 * @param {*} basePath 基础路径
		 * @param {*} arvs 命令行参数
		 * @param {*} webpackConfig webpack配置 
		 */
		constructor(basePath, arvs, webpackConfig) {
			// 基础路径
			this.basePath = basePath

			// 命令参数
			this.arvs = arvs

			// webpack配置信息
			this.webpackConfig = webpackConfig

			// 需要执行webpack命令的任务列表
			this.taskList = []

			// 是否全部编译
			this.isAll = false

			// 是否生成本地化包
			this.isLocal = false

			// 是否生成本地化包
			this.localDirName = "local"
			this.init()
		}
		init() {
			this.convertArvsToLowcase()
			this.resolveCmdParam()
			if (this.isAll)
				this.scan(this.basePath)
			else
				this.scan(this.basePath + '/' + this.arvs[0])
			
			if(this.isLocal && this.taskList.length>1){
				this.localDirName='local';
				console.log("如果是多页面，则文件夹名称统一为‘local’")
			}
			console.log(`本次要执行的任务列表：${this.taskList}`)
		}

		/**
		 * 将数组里面的参数部分转换为小写
		 */
		convertArvsToLowcase() {
			this.arvs.map((currentValue, index) => {
				if (index != 0 && !currentValue.includes("--"))
					return currentValue.toLowerCase()
				else
					return currentValue
			}, this.arvs)
		}

		/**
		 * 解析命令行参数，设置isAll
		 */
		resolveCmdParam() {
			if (this.arvs[0] === 'all') {
				this.isAll = true
			}

			if (this.arvs.includes('--local')) {
				const localIndex = this.arvs.indexOf('--local')
				const localDirName = this.arvs[localIndex + 1]
				this.isLocal = true
				if (localDirName && !localDirName.includes("--")) {
					this.localDirName = localDirName
				} else {
					this.localDirName = "local"
				}
			}
		}

		/**
		 * 扫描文件夹，找出所有符合规范的目录，建立任务列表
		 * @param {*} dirPath 需要扫描的文件夹路径
		 */
		scan(dirPath) {
			let that = this
			let absolutePath = path.resolve(__dirname, dirPath)
			if (this.checkPageDir(absolutePath)) {
				this.taskList.push(absolutePath)
				return
			}
			let files = fs.readdirSync(absolutePath)
			files.forEach(function (file) {
				let fullPath = absolutePath + '\\' + file
				let stats = fs.statSync(fullPath)
				if (stats.isDirectory()) {
					if (that.checkPageDir(fullPath))
						that.taskList.push(fullPath)
					else
						that.scan(fullPath)
				}
			})
		}

		/**
		 * 检查目录是不是符合规范的目录，规范如下：
		 * 1.入口文件main.js必须在根目录下；
		 * 2.模板文件tempalte.html必须有，且要在根目录下；
		 * @param {*} pageDir 
		 */
		checkPageDir(pageDir) {
			let hasMain = false
			let hasTemplate = false
			let files = fs.readdirSync(pageDir)
			files.forEach(function (file) {
				if (file === 'main.js') {
					hasMain = true
				} else if (file === 'template.html') {
					hasTemplate = true
				}
			})
			return hasMain && hasTemplate
		}

		/**
		 * 依次执行任务列表，每个任务执行前设置entry、output、HtmlWebpackPlugin插件 等信息
		 */
		run(spinner) {
			let that = this
			let tempBuildPath = that.taskList.shift()
			if (typeof tempBuildPath === 'undefined') {
				// spinner.stop()
				return
			}
			let webpackConfig = that.webpackConfig

			// 设置入口文件和输出路径
			webpackConfig.entry = path.resolve(`${tempBuildPath}\\main.js`)

			if (that.isLocal) {
				webpackConfig.output.path = path.resolve(tempBuildPath, that.localDirName);
				webpackConfig.output.publicPath = "";

				//本地化不要生成map文件
				webpackConfig.devtool = false;
			} else {
				webpackConfig.output.path = `${tempBuildPath}\\dist`
				//绝对路径转相对路径，例如："e:\website\static_project\webapp\busi\testOnePage"  =》  "/busi/testOnePage"
				let relativePath = tempBuildPath.replace(path.resolve(__dirname, '../'), '').replace(/\\/g, '/')
				webpackConfig.output.publicPath = config.build.assetsCdnPublicPath + `${relativePath}/dist/`;

				//非本地化时生成bundle分析报告
				if (config.build.bundleAnalyzerReport) {
					var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
					webpackConfig.plugins.push(new BundleAnalyzerPlugin(
						{
							analyzerMode: 'static',
							reportFilename: 'bundleAnalyzeReport.html',
							openAnalyzer: false
						}
					))
				}
			}

			webpackConfig = merge(webpackConfig, {
				plugins: [
					new HtmlWebpackPlugin({
						inject: true,
						filename: path.resolve(tempBuildPath, that.isLocal ? that.localDirName : "", "index.html"),
						template: `${tempBuildPath}\\template.html`,
						minify: {
							removeComments: true,
							collapseWhitespace: true,
							removeAttributeQuotes: true
						},
						// necessary to consistently work with multiple chunks via CommonsChunkPlugin
						chunksSortMode: 'dependency'
					})
				]

			})

			// 先删除，再执行build
			rm(path.resolve(tempBuildPath,that.isLocal ? that.localDirName : "dist"), err => {
				if (err) throw err
				webpack(webpackConfig, function (err, stats) {
					if (err) throw err
					process.stdout.write(stats.toString({
						colors: true,
						modules: false,
						children: false,
						chunks: false,
						chunkModules: false
					}) + '\n\n')

					console.log(chalk.cyan(`${tempBuildPath}  Build complete.\n`))
					console.log(chalk.yellow(
						'  Tip: built files are meant to be served over an HTTP server.\n' +
						"  Opening index.html over file:// won't work.\n"
					))
					that.run(spinner)
				})
			})
		}

	}
