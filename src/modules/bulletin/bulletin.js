import Vue from 'vue'
import HttpClient from '@/utils/httpclient.js'
import VueQuillEditor from 'vue-quill-editor'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '../../styles/inner.scss'

import App from './App.vue'

Vue.config.productionTip = false

Vue.use(HttpClient)
Vue.use(VueQuillEditor)
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
