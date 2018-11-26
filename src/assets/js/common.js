import { notification } from 'antd'

/* 截取url参数 */
function getUrl(e) {
    const url = e.search
    const theRequest = {}
    if (url.indexOf('?') !== -1) {
        const str = url.substr(1)
        const strs = str.split('&')
        for (let i = 0; i < strs.length; i += 1) {
            theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
        }
    }
    return theRequest
}
// 获取当前浏览器名 及 版本号
function appInfo() {
    const browser = { appname: 'unknown', version: 0 }
    const userAgent = window.navigator.userAgent.toLowerCase() // 使用navigator.userAgent来判断浏览器类型
    // msie,firefox,opera,chrome,netscape
    if (/(msie|firefox|opera|chrome|netscape)\D+(\d[\d.]*)/.test(userAgent)) {
        browser.appname = RegExp.$1
        browser.version = RegExp.$2
    } else if (/version\D+(\d[\d.]*).*safari/.test(userAgent)) { // safari
        browser.appname = 'safari'
        browser.version = RegExp.$2
    }
    return browser
}
/**
 * 浏览器兼容组件
 */
function explorerError() {
    // 判断浏览器当前版本
    const browser = appInfo()
    const browerName = browser.appname
    const exite = browerName.indexOf('msie')
    if (exite >= 0) {
        // 表示当前为IE浏览器
        if (browser.version < 11) {
            // 表示当前为IE10以下，则需要弹出通知框
            notification.warning({
                message: '浏览器兼容提示',
                description: '您当前使用的浏览器可能会存在一些兼容性问题，为了您更好的体验，建议您切换到高版本浏览器或使用推荐的谷歌浏览器。',
            })
        }
    }
}
export {
    getUrl,
    explorerError
}

