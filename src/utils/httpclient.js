import axios from 'axios'
import qs from 'qs'
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

/*
function transformResponse(data, headers) {
  /* eslint no-param-reassign:0 * /
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (e) { /* Ignore * / }
  }
  return data
}
function transformData (data, headers) {
  if (headers['content-type'].indexOf('json') >= 0) {
    return JSON.parse(data, dateReviver)
  } else {
    // Do something meaningful here
  }
}
*/

const httpClient = axios.create({
  baseURL: baseURL,
  timeout: 20000,
  // 响应的数据格式 json / blob / document / arraybuffer / text / stream
  responseType: 'json',
  withCredentials: true
})

// POST传参序列化(添加请求拦截器)
httpClient.interceptors.request.use(
  config => {
    // 在发送请求之前做某件事
    if (
      config.method === 'post' ||
      config.method === 'put' ||
      config.method === 'patch'
    ) {
      // Content-Type 对于 POST、PUT 和 PATCH 才有意义
      config.headers = {
        // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        'Content-Type': 'application/json; charset=UTF-8'
      }
      // 序列化
      config.data = JSON.stringify(config.data)
    } else if (
      config.method === 'delete' ||
      config.method === 'get' ||
      config.method === 'head'
    ) {
      // QueryString 序列化器
      config.paramsSerializer = function (params) {
        // arrayFormat: indices brackets repeat
        return qs.stringify(params, {
          arrayFormat: 'indices'
        })
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
      console.log(text)
      json = JSON.parse(text)
    } else {
      // 备注：不是 arraybuffer 可能会是 blob 等，这里暂未处理
      json = response.data
    }

    if (json) {
      if (json.url) {
        top.location = json.url
      } else if (json.code !== SuccessCode) {
        console.log(json)
        return Promise.reject(new ApiError(json.message))
      }
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
