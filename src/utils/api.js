import Vue from 'vue'

export default {
  login (params) {
    return Vue.httpClient.post('/admin/login', params)
  },
  refreshToken (params) {
    return Vue.httpClient.post('/admin/refreshToken', params)
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
  getBulletin () {
    return Vue.httpClient.get('/admin/getBulletin')
  },
  editBulletin (params) {
    return Vue.httpClient.post('/admin/editBulletin', params)
  },
  getModuleMetaDatas () {
    return Vue.httpClient.get('/admin/getModuleMetaDatas')
  },
  extractModuleMetaDatas () {
    return Vue.httpClient.get('/admin/extractModuleMetaDatas')
  },
  clearModulePermissions () {
    return Vue.httpClient.get('/admin/clearModulePermissions')
  },
  // 角色
  getRoleList () {
    return Vue.httpClient.get('/admin/getRoleList')
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
  // 分组
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
  getUserPage (params) {
    // return Vue.httpClient.get('/admin/getUserPage', { params: params })
    return Vue.httpClient.post('/admin/getUserPage', params)
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
  getUserStatuList () {
    return Vue.httpClient.get('/admin/getUserStatuList')
  },
  // 通知
  getNotificationsForManager (params) {
    return Vue.httpClient.post('/admin/getNotificationsForManager', params)
  },
  addNotification (params) {
    return Vue.httpClient.post('/admin/addNotification', params)
  },
  editNotification (params) {
    return Vue.httpClient.post('/admin/editNotification', params)
  },
  removeNotification (params) {
    return Vue.httpClient.post('/admin/removeNotification', params)
  },
  getNotifications (params) {
    return Vue.httpClient.post('/admin/getNotifications', params)
  },
  readNotifications (params) {
    return Vue.httpClient.post('/admin/readNotifications', params)
  },
  deleteNotifications (params) {
    return Vue.httpClient.post('/admin/deleteNotifications', params)
  },
  getNewestNotification (params) {
    return Vue.httpClient.post('/admin/getNewestNotification', params)
  },
  // 暂未使用
  getGroupList () {
    return Vue.httpClient.get('/admin/getGroupList')
  },
  // 基础数据
  getRoleBaseList () {
    return Vue.httpClient.get('/admin/getRoleBaseList')
  },
  getPermissionTree () {
    return Vue.httpClient.get('/admin/getPermissionTree')
  },
  // 直接调用
  callDirectly (url) {
    return Vue.httpClient.get(url)
  },
  // 下载文件
  download (url, params) {
    return Vue.httpClient.post(url, params, {
      responseType: 'arraybuffer'
    })
  }
}
