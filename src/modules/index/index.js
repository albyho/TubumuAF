import Vue from 'vue'
import ElementUI from 'element-ui'
import '../../theme/element-#2D2F33/index.css'
import App from './App.vue'
import HttpClient from '@/utils/httpclient.js'

Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.use(HttpClient)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
