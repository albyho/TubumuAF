import axios from 'axios'
import qs from 'qs'
var instance = axios.create({
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  withCredentials: true
})

export const baseURL = 'http://127.0.0.1:9005/manager/api'

export const requestLogin = params => { return instance.post(`${baseURL}/admin/login`, qs.stringify(params)).then(res => res.data) }

export const getUserList = params => { return instance.get(`${baseURL}/users`, { params: params }) }

export const getUserListPage = params => { return instance.get(`${baseURL}/users`, { params: params }) }

export const selectUser = params => { return instance.post(`${baseURL}/selects`, qs.stringify(params)).then(res => res.data) }

export const removeUser = params => { return instance.get(`${baseURL}/user/remove`, { params: params }) }

export const batchRemoveUser = params => { return instance.post(`${baseURL}/batchremove`, qs.stringify(params)).then(res => res.data) }

export const editUser = params => { return instance.post(`${baseURL}/change`, qs.stringify(params)).then(res => res.data) }

export const addUser = params => { return instance.post(`${baseURL}/users/add`, qs.stringify(params)).then(res => res.data) }
