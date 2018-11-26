import i18next from 'i18next'
import { reactI18nextModule } from 'react-i18next'
import zh from './zh.js'
import en from './en.js'

let nLng = 'en'
if (navigator.language.startsWith('zh')) {
    nLng = 'zh'
}
const lng = localStorage.lang || nLng || 'zh'
localStorage.lang = lng

// 将i8next配置全局配置到react-i8next(通过reactI18nextModule)
i18next
    .use(reactI18nextModule)
    .init({
        interpolation: {
            // React already does escaping
            escapeValue: false,
        },
        fallbackLng: 'en',
        lng, // 'en' | 'zh-CN'
        resources: {
            zh,
            en
        },
    }, (err, t) => {
        if (err) {
            return err
        }
        return t
    })

