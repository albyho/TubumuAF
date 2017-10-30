import axios from 'axios'
import qs from 'qs'
var instance = axios.create({
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  withCredentials: true
})

let base = 'http://127.0.0.1:9005/manager/api'

export const requestLogin = params => { return instance.post(`${base}/admin/login`, qs.stringify(params)).then(res => res.data) }

export const getUserList = params => { return instance.get(`${base}/users`, { params: params }) }

export const getUserListPage = params => { return instance.get(`${base}/users`, { params: params }) }

export const selectUser = params => { return instance.post(`${base}/selects`, qs.stringify(params)).then(res => res.data) }

export const removeUser = params => { return instance.get(`${base}/user/remove`, { params: params }) }

export const batchRemoveUser = params => { return instance.post(`${base}/batchremove`, qs.stringify(params)).then(res => res.data) }

export const editUser = params => { return instance.post(`${base}/change`, qs.stringify(params)).then(res => res.data) }

export const addUser = params => { return instance.post(`${base}/users/add`, qs.stringify(params)).then(res => res.data) }
