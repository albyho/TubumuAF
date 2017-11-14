import Vue from 'vue'

export default {
  login (params) {
    return Vue.httpClient.post('/admin/login', params)
  },
  logout () {
    return Vue.httpClient.post('/admin/logout')
  },
  getProfile () {
    return Vue.httpClient.get('/admin/getProfile')
  },
  changeProfile (params) {
    return Vue.httpClient.post('/admin/changeProfile', params)
  },
  changePassword (params) {
    return Vue.httpClient.post('/admin/changePassword', params)
  },
  getMenus () {
    return Vue.httpClient.get('/admin/getMenus')
  },
  getServerInfo () {
    return Vue.httpClient.get('/admin/getServerinfo')
  },
  getSiteConfig () {
    return Vue.httpClient.get('/admin/getSiteconfig')
  },
  editSiteConfig (params) {
    return Vue.httpClient.post('/admin/editSiteconfig', params)
  },
  getBulletin () {
    return Vue.httpClient.get('/admin/getBulletin')
  },
  editBulletin (params) {
    return Vue.httpClient.post('/admin/editBulletin', params)
  },
  getPermissions () {
    return Vue.httpClient.get('/admin/getPermissions')
  },
  getPermissionTree () {
    return Vue.httpClient.get('/admin/getPermissionTree')
  },
  extractModulePermissions () {
    return Vue.httpClient.get('/admin/extractModulePermissions')
  },
  clearModulePermissions () {
    return Vue.httpClient.get('/admin/clearModulePermissions')
  },
  getRoles () {
    return Vue.httpClient.get('/admin/getRoles')
  },
  moveRole (params) {
    return Vue.httpClient.post('/admin/moveRole', params)
  },
  removeRole (params) {
    return Vue.httpClient.post('/admin/removeRole', params)
  },
  saveRoleName (params) {
    return Vue.httpClient.post('/admin/saveRoleName', params)
  },
  addRole (params) {
    return Vue.httpClient.post('/admin/addRole', params)
  },
  editRole (params) {
    return Vue.httpClient.post('/admin/editRole', params)
  },
  getGroups () {
    return Vue.httpClient.get('/admin/getGroups')
  },
  getGroupTree () {
    return Vue.httpClient.get('/admin/getGroupTree')
  }
}
