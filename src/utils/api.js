import Vue from 'vue'

export default {
  login (params) {
    return Vue.httpClient.post('/admin/login', params)
  },
  logout () {
    return Vue.httpClient.post('/admin/logout')
  },
  getProfile () {
    return Vue.httpClient.get('/admin/getprofile')
  },
  getMenus () {
    return Vue.httpClient.get('/admin/getmenus')
  },
  getPermissions () {
    return Vue.httpClient.get('/admin/getPermissions')
  },
  getRoles () {
    return Vue.httpClient.get('/admin/getRoles')
  }
}
