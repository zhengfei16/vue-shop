# webapp

> A Vue.js project


## 前期准备
* cd webapp
* npm install 安装依赖


## 说明
   本架构是基于vue脚手架（webpack）改造，现开发、生产构建都是通过build.js完成，如果是开发阶段，配合dev-server，同样能实现监听文件改变以及热重载功能。单元测试都是通过karma.js完成。
   一个有效页面的文件夹下应该包含template.html（模板文件） 和 main.js(入口文件)

## 命令相关 
> dev-server模式，需要将import Vue from 'vue'，并将pics的vue核心文件引用注释；build模式，需放开pics的vue核心文件引用，并注释import Vue from 'vue'。

node build/dev-server all
构建busi文件夹下所有有效页面，业务代码引用为相对路径，并启动dev-server服务

node build/build all
构建busi文件夹下所有有效页面，业务代码引用为pics路径

node build/karma all
执行test/unit/specs下所有以.spec.js结尾的测试脚本

node build/dev-server one
单文件构建，默认生成的资源以相对路径引用，并启动dev-server服务

node build/build one
单文件构建，默认生成的资源以pics绝对路径引用

node build/build mone
多文件构建，会扫描并构建more下所有合法页面，默认生成的资源以绝对路径引用

node build/karma one
执行test/unit/specs/one下所有以.spec.js结尾的测试脚本

## 参数相关
--local
生成本地化文件夹，通常用法是：
    node build/build testOnePage --local localDirName

注意点如下：
    1.如果是多页面，则文件夹名称统一为‘local’
    2.localDirName是本地化文件夹名称，必须紧跟在--local参数后面，如果不传则默认为local

## eslint相关
构建的时候很可能会出现eslint报错信息，如果使用vscode编辑器，建议装ESLint插件，它会检测.eslinttrc配置文件，当不符合规则的时候，会有提示


For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
