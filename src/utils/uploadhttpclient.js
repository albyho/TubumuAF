import axios from 'axios'
import { baseUrl } from './config.js'

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
  baseURL: baseUrl,
  timeout: 20000,
  // 响应的数据格式 json / blob / document / arraybuffer / text / stream
  responseType: 'json',
  withCredentials: true
})

// POST 传参序列化(添加请求拦截器)
httpClient.interceptors.request.use(
  config => {
    // 在发送请求之前做某件事
    if (config.method === 'post') {
      config.headers = {
        'Content-Type': 'multipart/form-data'
      }
    }

    // 若是有做鉴权token , 就给头部带上token
    if (localStorage.token) {
      config.headers.Authorization = 'Bearer ' + localStorage.token
    }
    return config
  },
  error => {
    return error
  }
)

// 返回状态判断(添加响应拦截器)
httpClient.interceptors.response.use(
  response => {
    if (response.headers['content-type'].indexOf('json') === -1) {
      // 返回的数据不是 json (或是 json 但服务器的 content-type 设置不准确)
      return response
    }
    // 仅处理 json 数据
    let json
    if (response.request.responseType === 'arraybuffer' && response.data.toString() === '[object ArrayBuffer]') {
      // 返回的数据是 arraybuffer，内容是 json
      // 备注：可能内容不是 json，这里暂未处理
      const text = Buffer.from(response.data).toString('utf8')
      json = JSON.parse(text)
    } else {
      // 备注：不是 arraybuffer 可能会是 blob 等，这里暂未处理
      json = response.data
    }

    if (json) {
      if (json.data) {
        if (json.data.token) {
          localStorage.token = json.data.token
        }
        if (json.data.refreshToken) {
          localStorage.refreshToken = json.data.refreshToken
        }
      }

      if (json.code !== SuccessCode) {
        console.log(json)
        return Promise.reject(new ApiError(json.message))
      }
    }

    return response
  },
  error => {
    console.log(error.response.headers)
    if (error.response.status === 401) {
      if (error.response.headers['content-type'].indexOf('json') !== -1 && error.response.data.url) {
        top.location = error.response.data.url
        return
      }
      if (error.response.headers['token-expired'] && localStorage.token && localStorage.refreshToken) {
        console.log('Refresh Token')
        const params = {
          token: localStorage.token,
          refreshToken: localStorage.refreshToken
        }
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        httpClient.post('/admin/refreshToken', params)
        return Promise.reject(new ApiError('登录超时，自动登录中......', ErrorType.Sysetem, error))
      }
    }
    return Promise.reject(new ApiError(error.message, ErrorType.Sysetem, error))
  }
)

// 对 axios 的实例重新封装成一个 plugin ,方便 Vue.use(xxxx)
export default {
  install: function (Vue, option = {}) {
    // 1.通过 Vue.httpClient 调用
    Vue.uploadHttpClient = httpClient
    // 2.通过 this.$httpClient 调用
    Vue.prototype.$uploadHttpClient = httpClient
  }
}
