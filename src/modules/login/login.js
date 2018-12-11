import Vue from 'vue'
import HttpClient from '@/utils/httpclient.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret, faKey } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faUserSecret, faKey)

Vue.config.productionTip = false

Vue.use(HttpClient)
Vue.use(ElementUI, { size: 'small' })
Vue.component('font-awesome-icon', FontAwesomeIcon)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
