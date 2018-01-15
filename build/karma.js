let fs = require('fs')
let path = require('path')

process.env.NODE_ENV = 'testing'
process.env.BABEL_ENV = 'test'

let karmaRunnerConfig = require('./webpack.test.conf')
let KarmaRunner = require('./KarmaRunner')

let arvs = process.argv.slice(2)
new KarmaRunner(arvs, karmaRunnerConfig).run()


/**
 *  检验参数合法性，标准写法为：node build/karma.js pagePath
 * 1.参数不能为空，如：node build/karma.js
 * 2.指定的目录必须存在，如：node build/karma.js xxx  ,但是xxx是不村在的
 * @param {*} params 命令后面的参数列表
 */
let validateCmdParam = function (params) {
	let result = true
	if (params.length == 0) {
		console.log('参数不能为空，正确的格式为：node build/karma.js pagePath')
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