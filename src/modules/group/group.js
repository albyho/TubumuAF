import Vue from 'vue'
import ElementUI from 'element-ui'
// import { Form, FormItem, Button } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '../../styles/inner.scss'
import App from './App.vue'

// 仅引入用到的图标
import 'vue-awesome/icons/users'
import 'vue-awesome/icons/user-times'
// 一次引入全部图标
// import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'

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

Vue.component('icon', Icon)

Vue.use(HttpClient)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
