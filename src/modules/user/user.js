import Vue from 'vue'
import HttpClient from '@/utils/httpclient.js'
import UploadHttpClient from '@/utils/uploadhttpclient.js'
import ElementUI from 'element-ui'
import XLUserStatusSelect from '@/components/XLUserStatusSelect.vue'
import XLUserStatusRadioGroup from '@/components/XLUserStatusRadioGroup.vue'
import XLGroupCascader from '@/components/XLGroupCascader.vue'
import XLDatepicker from '@/components/XLDatepicker.vue'
import 'element-ui/lib/theme-chalk/index.css'
import '../../styles/inner.scss'

import router from './router'

Vue.config.productionTip = false

Vue.use(HttpClient)
Vue.use(UploadHttpClient)
Vue.use(ElementUI, { size: 'mini' })

// 全局注册
Vue.component('xl-userStatusSelect', XLUserStatusSelect)
Vue.component('xl-userStatusRadioGroup', XLUserStatusRadioGroup)
Vue.component('xl-groupCascader', XLGroupCascader)
Vue.component('xl-datePicker', XLDatepicker)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<router-view/>'
})
