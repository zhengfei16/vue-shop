let fs = require('fs')
let path = require('path')
let Server = require('karma').Server
let cfg = require('karma').config

module.exports =
	class TaskRunner {
		/**
		 * @param {Array} arvs 命令行参数
		 * @param {Object} webpackConfig webpack配置 
		 */
		constructor(arvs, webpackConfig) {
			//命令行参数
			this.arvs = arvs

			// webpack配置信息
			this.webpackConfig = webpackConfig

			// 查找spec文件的路径
			this.relativePath = ""

			this.init()
		}
		init() {

			if (this.arvs[0] !== 'all')
				this.relativePath = this.arvs[0]

			// 删除externals配置，否则会找不到Vue、VueRouter等
			delete this.webpackConfig.externals
		}

		/**
		 * 依次执行任务列表，每个任务执行前设置entry、output、HtmlWebpackPlugin插件 等信息
		 */
		run() {
			var exist = fs.existsSync(`./test/unit/specs/${this.relativePath}`)
			if (exist) {
				console.log(`本次karma要扫描的文件夹是：${this.arvs[0] === 'all' ? "all" : this.relativePath}`)
			} else {
				return
			}

			//自动化测试脚本的匹配路径
			const filesPath = `./specs/${this.relativePath}/**/*.spec.js`

			//karma的扩展配置
			let extendConfig = {}
			extendConfig.port = 1337
			extendConfig.files = [filesPath]
			extendConfig.preprocessors = {}
			extendConfig.preprocessors[filesPath] = ['webpack', 'sourcemap']
			extendConfig.webpack = this.webpackConfig

			let karmaConfig = cfg.parseConfig(path.resolve('./test/unit/karma.conf.js'), extendConfig)
			let server = new Server(karmaConfig, function (exitCode) {
				console.log('Karma has exited with ' + exitCode)
				process.exit(exitCode)
			}).start()
		}
	}
