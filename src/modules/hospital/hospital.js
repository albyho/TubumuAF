import Vue from 'vue'
import HttpClient from '@/utils/httpclient.js'
import ElementUI from 'element-ui'
import XLUserStatusSelect from '@/components/XLUserStatusSelect.vue'
import XLUserStatusRadioGroup from '@/components/XLUserStatusRadioGroup.vue'
import XLGroupCascader from '@/components/XLGroupCascader.vue'
import 'element-ui/lib/theme-chalk/index.css'
import '../../styles/inner.scss'

import App from './App.vue'

Vue.config.productionTip = false

Vue.use(HttpClient)
Vue.use(ElementUI, { size: 'mini' })

// 全局注册
Vue.component('xl-userStatusSelect', XLUserStatusSelect)
Vue.component('xl-userStatusRadioGroup', XLUserStatusRadioGroup)
Vue.component('xl-groupCascader', XLGroupCascader)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
