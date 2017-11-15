import Vue from 'vue'
import ElementUI from 'element-ui'
// import { Form, FormItem, Button } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '../../styles/inner.scss'
// import 'font-awesome/css/font-awesome.css'
import App from './App.vue'
import HttpClient from '@/utils/httpclient.js'

Vue.config.productionTip = false

// 全部引入
Vue.use(ElementUI)
// 按需引入
/*
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Button)
*/

Vue.use(HttpClient)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
