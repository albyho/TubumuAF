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
  getModuleConfig () {
    return Vue.httpClient.get('/admin/getModuleConfig')
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
  getUsers (params) {
    // return Vue.httpClient.get('/admin/getUsers', { params: params })
    return Vue.httpClient.post('/admin/getUsers', params)
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
  getUserStatus () {
    return Vue.httpClient.get('/admin/getUserStatus')
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
  getGroups () {
    return Vue.httpClient.get('/admin/getGroups')
  },
  // 基础数据
  getRoleBases () {
    return Vue.httpClient.get('/admin/getRoleBases')
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
  },
  // 床柜项目
  // 床柜
  getHospitalDeviceInfoBasePage (params) {
    return Vue.httpClient.post('/hospitaldevice/getHospitalDeviceInfoBasePage', params)
  },
  getHospitalDeviceBasePage (params) {
    return Vue.httpClient.post('/hospitaldevice/getHospitalDeviceBasePage', params)
  },
  setHospitalDeviceIsDeleted (params) {
    return Vue.httpClient.post('/hospitaldevice/setIsDeleted', params)
  },
  addHospitalDevice (params) {
    return Vue.httpClient.post('/hospitaldevice/add', params)
  },
  editHospitalDevice (params) {
    return Vue.httpClient.post('/hospitaldevice/edit', params)
  },
  importHospitalDevice (params) {
    return Vue.httpClient.post('/hospitaldevice/import', params)
  },
  // 医院
  getHospitalUserInfoBasePage (params) {
    return Vue.httpClient.post('/hospital/getHospitalUserInfoBasePage', params)
  },
  addHospital (params) {
    return Vue.httpClient.post('/hospital/add', params)
  },
  editHospital (params) {
    return Vue.httpClient.post('/hospital/edit', params)
  },
  // 科室
  getHospitalDepartmentBasePage (params) {
    return Vue.httpClient.post('/hospitaldepartment/getHospitalDepartmentBasePage', params)
  },
  setHospitalDepartmentIsDeleted (params) {
    return Vue.httpClient.post('/hospitaldepartment/setIsDeleted', params)
  },
  addHospitalDepartment (params) {
    return Vue.httpClient.post('/hospitaldepartment/add', params)
  },
  editHospitalDepartment (params) {
    return Vue.httpClient.post('/hospitaldepartment/edit', params)
  },
  // 病房
  getHospitalSickroomBasePage (params) {
    return Vue.httpClient.post('/hospitalsickroom/getHospitalSickroomBasePage', params)
  },
  setHospitalSickroomIsDeleted (params) {
    return Vue.httpClient.post('/hospitalsickroom/setIsDeleted', params)
  },
  addHospitalSickroom (params) {
    return Vue.httpClient.post('/hospitalsickroom/add', params)
  },
  editHospitalSickroom (params) {
    return Vue.httpClient.post('/hospitalsickroom/edit', params)
  },
  // 床位
  getHospitalBunkBasePage (params) {
    return Vue.httpClient.post('/hospitalbunk/getHospitalBunkBasePage', params)
  },
  setHospitalBunkIsDeleted (params) {
    return Vue.httpClient.post('/hospitalbunk/setIsDeleted', params)
  },
  addHospitalBunk (params) {
    return Vue.httpClient.post('/hospitalbunk/add', params)
  },
  editHospitalBunk (params) {
    return Vue.httpClient.post('/hospitalbunk/edit', params)
  },
  editHospitalBunkDevice (params) {
    return Vue.httpClient.post('/hospitalbunk/setDevice', params)
  }
}
