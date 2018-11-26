import React from 'react'
import { BrowserRouter as Router, Switch, Redirect } from 'react-router-dom'
import { LocaleProvider } from 'antd'
import { I18n } from 'react-i18next'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import enUS from 'antd/lib/locale-provider/en_US'
// import 'element-theme-default';/* eslint-disable-line */

import './styles/App.scss'
import routes from './routes.js'
import RouteWithSubRoutes from './components/routeWithSubRoutes'
// import Hook from './components/hook'
// import IndexFooter from './components/IndexFooter'
// import Theme from './components/theme';

export default function App() {
    return (
        <I18n>
            {
                (t, { i18n }) => (
                    <Router>
                        <div>
                            <LocaleProvider locale={i18n.language === 'zh' ? zhCN : enUS}>
                                <Switch>
                                    {
                                        routes.map(route => (
                                            <RouteWithSubRoutes {...route} key={route.path} />
                                        ))
                                    }
                                    <Redirect to="/home" />
                                </Switch>
                            </LocaleProvider>
                        </div>
                    </Router>
                )
            }
        </I18n>
    )
}
