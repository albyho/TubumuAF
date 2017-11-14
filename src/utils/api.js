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
  getServerInfo () {
    return Vue.httpClient.get('/admin/getserverinfo')
  },
  getSiteConfig () {
    return Vue.httpClient.get('/admin/getsiteconfig')
  },
  editSiteConfig (params) {
    return Vue.httpClient.post('/admin/editsiteconfig', params)
  },
  getBulletin () {
    return Vue.httpClient.get('/admin/getbulletin')
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
    return Vue.httpClient.get('/admin/getgroups')
  },
  getGroupTree () {
    return Vue.httpClient.get('/admin/getgroupTree')
  }
}
