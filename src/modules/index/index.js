import Vue from 'vue'
import HttpClient from '@/utils/httpclient.js'
import XLMenu from '@/components/XLMenu.vue'
import ElementUI from 'element-ui'
import '../../theme/element-#2D2F33/index.css'

import App from './App.vue'

Vue.config.productionTip = false

Vue.use(HttpClient)
Vue.use(ElementUI, { size: 'mini' })

// 全局注册
Vue.component('xl-menu', XLMenu)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
