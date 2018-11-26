# react-web

> react, webpack构建

## 项目结构 ##

```
.
├── mock  ----------------------------- 本地mock配置文件
├── package.json  --------------------- 项目配置
├── README.md  ------------------------ 说明文件
├── build  ---------------------------- 构建代码文件
├── config  --------------------------- 构建配置文件
├── index.html  ----------------------- 入口页面
└── src  ------------------------------ 源码目录
    ├── assets  ----------------------- 项目资源文件目录（图片、字体等）
    ├── components  ------------------- 业务模块集合目录（组件）
    ├── fetch  ------------------------ ajax请求管理文件
    ├──   └── api  -------------------- 请求配置 (axios ajax配置管理文件)
    ├── i18n   ------------------------ 国际化配置
    ├── pages  ------------------------ 页面集合目录
    ├── reducers  --------------------- redux文件目录
    ├── styles   ---------------------- 公共样式库
    ├── App.js  ----------------------- react公共配置文件
    └── main.js  ---------------------- 项目级入口配置文件
    └── routes.js  -------------------- react路由配置文件
```

## 环境准备

``` bash
# 安装依赖
npm install || yarn install

# 启动本地调试 localhost:8080
npm run dev || yarn dev

# 本地打包压缩
npm run build || yarn build
```

## AntD
本项目已集成AntD，并已配置其按需加载功能
更多AntD控件请查看地址：https://ant.design/index-cn

## 反代理配置

本地代码想要访问测试环境接口可以通过以下配置
`/config/index.js` 
``` bash
dev: {
  proxyTable: {
    '/api': {
      target: 'http://jsonplaceholder.typicode.com/',
      changeOrigin: true,
      pathRewrite: {'^/api': ''}
    }
  }
}
```

## 引入新的页面

页面统一在`/src/pages`目录中添加<br/>
同事当项目无限大的时候通过router一次性加载全部的页面需要用户非常大耐心<br />
所有我们在代码中统一使用router按需加载配置，在`routes.js`添加page使用如下方式
``` bash
{
    path: '/',
    component: loadableHandler(() => import('./pages/home'))
}
```
命令生成page，routes会自动加入该配置

## 自定义模块组件

页面和组件分开目录编写有益于代码维护，自定义组件或业务公共模块统一在`/src/components/`目录开发结构可与pages相同

## 开发所需技术

* typescript      javascript的超集，扩展javascript的语法
* react           主要架构
* redux           状态管理工具
* react-i18next   国际化插件
* react-router    react路由插件
* axios           ajax异步请求插件   
* css-modules     css模块工具适合react样式开发
* sass            css预处理结合css-modules

## react-i18next国际化

项目已添加国际支持 <br/>
详细情况 https://github.com/i18next/react-i18next

### axios 使用
axios为前后端交互使用的三方件，即ajax异步请求插件
使用方法如下：
1、在src/fetch文件夹下的apis.js中添加配置

``` bash
export default {
    requestName: conversion('requestURL', 'requestType'),
}
```
requestName：请求的名称，用户自定义
requestURL：请求的URL，如：blockChain/query
requestType：请求的类型，分为：post/get/delete/put
2、需要使用的时候则需要引入fetch下的index文件文件
``` bash
import apis from '../../fetch/'
```
3、获取后台请求
``` bash
demo = async () => {
	const res = await apis.requestName({
		id: '1',
		name: 'helloworld'
	})
}
```
使用时需要使用await关键字对请求进行同步等待，外层的函数需要使用async关键字进行异步的标识。

### 时间格式转换 moment
时间格式转换插件moment，可以通过moment强大的功能提供各种各样的时间转换，计算等等。
地址：http://momentjs.cn/

``` bash

@button-primary-bg-color: #ea2f2f;
@button-primary-active-bg-color: #da2f2f;

```