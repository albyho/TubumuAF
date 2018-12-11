import Vue from 'vue'
import HttpClient from '@/utils/httpclient.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '../../styles/inner.scss'

import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faUsers, faUserTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faUsers, faUserTimes)

Vue.config.productionTip = false

Vue.use(HttpClient)
Vue.use(ElementUI, { size: 'mini' })
Vue.component('font-awesome-icon', FontAwesomeIcon)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
