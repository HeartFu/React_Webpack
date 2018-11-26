import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import reduxPromise from 'redux-promise'
import './i18n'
import App from './App.js'
import reducers from './reducers'
// import './styles/testcss.css'

// rem 定义根节点font-size 移动端专属
// (function setFontSize(cw) {
//     function setRootFontSize() {
//         let w = document.documentElement.getBoundingClientRect().width;
//         w = w > cw ? cw : w;
//         const per = w / cw;
//         document.documentElement.style.fontSize = `${per * 100}px`;
//     }
//     setRootFontSize();
//     window.onresize = setRootFontSize;
// }(750));

const store = createStore(reducers, applyMiddleware(reduxPromise))

ReactDom.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)
