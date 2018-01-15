// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // 使用推荐设置
  extends: 'lvmama',
  // required to lint *.vue files
  plugins: [
    'html'
  ]
}
