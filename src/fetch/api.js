// 配置简化转换
function conversion(url, method) {
    return {
        url,
        method
    }
}

// ajax通用配置
export default {
    // example
    blockInfo: conversion('test/test', 'get'),
}
