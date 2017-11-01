import Vue from 'vue'
import ElementUI from 'element-ui'
import '../../theme/element-#2D2F33/index.css'
import App from './App.vue'
import HttpClient from '@/utils/httpclient.js'
import XLMenu from '@/components/XLMenu.vue'

Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.use(HttpClient)

// 全局注册
Vue.component('xl-menu', XLMenu)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
