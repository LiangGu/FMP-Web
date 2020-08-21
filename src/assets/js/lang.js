import VueI18n from 'vue-i18n'
import en from '../js/locale/lang/en'
import zhCN from '../js/locale/lang/zh-CN'
import ja from '../js/locale/lang/ja'
import elZhCN from 'element-ui/lib/locale/lang/zh-CN'
import elEn from 'element-ui/lib/locale/lang/en'
import elJa from 'element-ui/lib/locale/lang/ja'
import utils from '@js/utils'

import Vue from 'vue'

Vue.use(VueI18n)

let lang = localStorage.getItem('lang') ? localStorage.getItem('lang') : 'zh'

// 国际化options
let options = {
    locale: lang,
    messages: {
        'en': {
            ...en,
            ...elEn,
            name: 'En',
            text: '英文'
        },
        'zh': {
            ...zhCN,
            ...elZhCN,
            name: '中',
            text: '中文'
        },
        'ja': {
            ...ja,
            ...elJa,
            name: 'あ',
            text: '日文'
        }
    },
    silentFallbackWarn: true
}

// 国际化
const i18n = new VueI18n(options)

// TODO 异步加载翻译数据
// utils.sendReq({
//     queryUrl: 'getI18nData',
//     req: {
//         method: 'post',
//         data: {},
//         success: function (res) {
//             let zh = {
//                 menu: res.data.data.menu,
//                 ...zhCN,
//                 ...elZhCN,
//                 name: '中',
//                 text: '中文'
//             }
//             i18n.setLocaleMessage('zh', zh)
//         }
//     }
// })
export default {
    options,
    i18n
}
