require('./check-versions')()
let fs = require('fs')
let path = require('path')

process.env.NODE_ENV = 'production'

let ora = require('ora')
let webpackRunnerConfig = require('./webpack.prod.conf')
// let spinner = ora('building for production...')
let WebpackRunner = require('./WebpackRunner')
// // 基础文件夹
let basePath = '../busi'

/**
 * 初始化函数，获得命令后面的参数，扫描文件夹，建立任务列表
 */
let init = function () {
	let arvs = process.argv.slice(2)
	// 校验参数正确性
	if (!validateCmdParam(arvs))
		return

	// spinner.start()
	new WebpackRunner(basePath, arvs, webpackRunnerConfig).run()
}

/**
 *  检验参数合法性，标准写法为：node build/build.js pagePath
 * 1.参数不能为空，如：node build/build.js
 * 2.指定的目录必须存在，如：node build/build.js xxx  ,但是xxx是不存在的
 * @param {*} params 命令后面的参数列表
 */
let validateCmdParam = function (params) {
	let result = true
	if (params.length == 0) {
		console.log('参数不能为空，正确的格式为：node build/build.js pagePath')
		result = false
	} else if (params.length > 0 && params[0].toLowerCase() !== 'all') {
		let absolutePath = path.resolve(__dirname, basePath, params[0])
		if (!fs.existsSync(absolutePath)) {
			console.log('路径不存在')
			result = false
		}
	}
	return result
}

init()
