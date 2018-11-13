import Vue from 'vue'
import VueRouter from 'vue-router'
import HttpClient from '@/utils/httpclient.js'
import ElementUI from 'element-ui'
import XLUserStatusSelect from '@/components/XLUserStatusSelect.vue'
import XLUserStatusRadioGroup from '@/components/XLUserStatusRadioGroup.vue'
import XLGroupCascader from '@/components/XLGroupCascader.vue'
import XLDatePicker from '@/components/XLDatePicker.vue'
import 'element-ui/lib/theme-chalk/index.css'
import '../../styles/inner.scss'

import router from './router'

Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(HttpClient)
Vue.use(ElementUI, { size: 'mini' })

// 全局注册
Vue.component('xl-userStatusSelect', XLUserStatusSelect)
Vue.component('xl-userStatusRadioGroup', XLUserStatusRadioGroup)
Vue.component('xl-groupCascader', XLGroupCascader)
Vue.component('xl-datePicker', XLDatePicker)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<router-view></router-view>',
  router
})
