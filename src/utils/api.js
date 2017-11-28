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
  // 系统管理
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
  extractModulePermissions () {
    return Vue.httpClient.get('/admin/extractModulePermissions')
  },
  clearModulePermissions () {
    return Vue.httpClient.get('/admin/clearModulePermissions')
  },
  // 角色
  getRoles () {
    return Vue.httpClient.get('/admin/getRoles')
  },
  addRole (params) {
    return Vue.httpClient.post('/admin/addRole', params)
  },
  editRole (params) {
    return Vue.httpClient.post('/admin/editRole', params)
  },
  removeRole (params) {
    return Vue.httpClient.post('/admin/removeRole', params)
  },
  moveRole (params) {
    return Vue.httpClient.post('/admin/moveRole', params)
  },
  saveRoleName (params) {
    return Vue.httpClient.post('/admin/saveRoleName', params)
  },
  // 用户组
  getGroupTree () {
    return Vue.httpClient.get('/admin/getGroupTree')
  },
  addGroup (params) {
    return Vue.httpClient.post('/admin/addGroup', params)
  },
  editGroup (params) {
    return Vue.httpClient.post('/admin/editGroup', params)
  },
  removeGroup (params) {
    return Vue.httpClient.post('/admin/removeGroup', params)
  },
  moveGroup (params) {
    return Vue.httpClient.post('/admin/moveGroup', params)
  },
  // 用户
  getUsers (params) {
    return Vue.httpClient.get('/admin/getUsers', { params: params })
  },
  addUser (params) {
    return Vue.httpClient.post('/admin/addUser', params)
  },
  editUser (params) {
    return Vue.httpClient.post('/admin/editUser', params)
  },
  removeUser (params) {
    return Vue.httpClient.post('/admin/removeUser', params)
  },
  // 暂未使用
  getGroups () {
    return Vue.httpClient.get('/admin/getGroups')
  },
  // 基础数据
  getRoleBases () {
    return Vue.httpClient.get('/admin/getRoleBases')
  },
  getPermissionTree () {
    return Vue.httpClient.get('/admin/getPermissionTree')
  }
}
