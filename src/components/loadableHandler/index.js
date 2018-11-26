import React from 'react'
import Loadable from 'react-loadable'
// import styles from './loadableHandler.scss';

function Loading() {
    // if (props.error) {
    //     return <div className={styles.main} >Error!</div>;
    // } else if (props.timedOut) {
    //     return <div className={styles.main} >Taking a long time...</div>;
    // } else if (props.pastDelay) {
    //     return <div className={styles.main} >Loading...</div>;
    // }
    return <div>Please Wait...</div>
}

// 实现页面组件按需引入
export default function loadableHandler(componentLoad) {
    return Loadable({
        loader: componentLoad,
        loading: Loading,
        delay: 300,
    })
}
