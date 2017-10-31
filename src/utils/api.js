import Vue from 'vue'

export default {
  login (params) {
    return Vue.httpClient.post('/admin/login', params)
  },
  getMenus () {
    return Vue.httpClient.post('/admin/getmenus')
  }
}
