import Vue from 'vue'
import ElementUI from 'element-ui'
import '../../theme/element-#2D2F33/index.css'
import App from './App.vue'

Vue.config.productionTip = false

Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
