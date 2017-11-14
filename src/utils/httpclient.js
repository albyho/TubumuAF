import axios from 'axios'
// import qs from 'qs'
// import { Message } from 'element-ui'
import { baseURL } from './config.js'

const SuccessCode = 200

// 自定义错误
const ErrorType = {
  'Default': 'default',
  'Sysetem': 'sysetem'
}

function ApiError (message, errorType, innerError) {
  this.name = 'ApiError'
  this.message = message || 'Default Message'
  this.errorType = errorType || ErrorType.Default
  this.innerError = innerError
  this.stack = (new Error()).stack
}
ApiError.prototype = Object.create(Error.prototype)
ApiError.prototype.constructor = ApiError

const httpClient = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  // 响应的数据格式 json / blob /document / arraybuffer / text / stream
  responseType: 'json',
  withCredentials: true,
  headers: {
    // 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    'Content-Type': 'application/json; charset=utf-8'
  }
})

// POST传参序列化(添加请求拦截器)
httpClient.interceptors.request.use(
  config => {
    // 在发送请求之前做某件事
    if (
      config.method === 'post' ||
      config.method === 'put' ||
      config.method === 'delete'
    ) {
      // 序列化
      config.data = JSON.stringify(config.data)
      // config.data = qs.stringify(config.data)
    }

    // 若是有做鉴权token , 就给头部带上token
    /*
    if (localStorage.token) {
      config.headers.Authorization = localStorage.token;
    }
    */
    return config
  },
  error => {
    return error
  }
)

// 返回状态判断(添加响应拦截器)
httpClient.interceptors.response.use(
  response => {
    // 对响应数据做些事
    if (response.data && response.data.url) {
      top.location = response.data.url
    } else if (response.data && response.data.code !== SuccessCode) {
      /*
      Message({
        // 饿了么的消息弹窗组件
        showClose: true,
        message: response.data.message,
        type: 'error'
      })
      */
      return Promise.reject(new ApiError(response.data.message))
    }
    return response
  },
  error => {
    // 返回 response 里的错误信息
    return Promise.reject(new ApiError(error.message, ErrorType.Sysetem, error))
  }
)

// 对 axios 的实例重新封装成一个 plugin ,方便 Vue.use(xxxx)
export default {
  install: function (Vue, option = {}) {
    // 1.通过 Vue.httpClient 调用
    Vue.httpClient = httpClient
    // 2.通过 this.$httpClient 调用
    Vue.prototype.$httpClient = httpClient
  }
}
