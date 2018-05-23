import Vue from 'vue'
import HttpClient from '@/utils/httpclient.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import App from './App.vue'

Vue.config.productionTip = false

Vue.use(HttpClient)
Vue.use(ElementUI, { size: 'mini' })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
