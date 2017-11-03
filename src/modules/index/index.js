import Vue from 'vue'
import ElementUI from 'element-ui'
// import { Container, Header, Aside, Main, Dropdown, DropdownMenu, DropdownItem, Menu, Submenu, MenuItem, MenuItemGroup, Row, Col } from 'element-ui'
import '../../theme/element-#2D2F33/index.css'
import App from './App.vue'
import HttpClient from '@/utils/httpclient.js'
import XLMenu from '@/components/XLMenu.vue'

Vue.config.productionTip = false

// 全部引入
Vue.use(ElementUI)
// 按需引入
/*
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Row)
Vue.use(Col)
*/

Vue.use(HttpClient)

// 全局注册
Vue.component('xl-menu', XLMenu)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
