import Vue from 'vue'
import HttpClient from '@/utils/httpclient.js'
import UploadHttpClient from '@/utils/uploadhttpclient.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '../../styles/inner.scss'

import App from './App.vue'

Vue.config.productionTip = false

Vue.use(HttpClient)
Vue.use(UploadHttpClient)
Vue.use(ElementUI, { size: 'mini' })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
