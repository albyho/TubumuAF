import axios from 'axios'
import qs from 'qs'
var instance = axios.create({
  headers: {'content-Type': 'application/x-www-form-urlencoded'}
})

// instance .post(`url`, qs.stringify(params)).then(res => res.data);
let base = 'http://127.0.0.1:3006'

export const requestLogin = params => { return instance.post(`${base}/select`, qs.stringify(params)).then(res => res.data) }

export const getUserList = params => { return instance.get(`${base}/users`, { params: params }) }

export const getUserListPage = params => { return instance.get(`${base}/users`, { params: params }) }

export const selectUser = params => { return instance.post(`${base}/selects`, qs.stringify(params)).then(res => res.data) }

export const removeUser = params => { return instance.get(`${base}/user/remove`, { params: params }) }

export const batchRemoveUser = params => { return instance.post(`${base}/batchremove`, qs.stringify(params)).then(res => res.data) }

export const editUser = params => { return instance.post(`${base}/change`, qs.stringify(params)).then(res => res.data) }

export const addUser = params => { return instance.post(`${base}/users/add`, qs.stringify(params)).then(res => res.data) }
