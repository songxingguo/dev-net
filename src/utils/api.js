import axios from 'axios'
import NetConfig from '../config/net'

const TOKEN_NAME = 'access_token'
let authToken = getAuthToken()

export function setAuthToken (value) {
  window.localStorage.setItem(TOKEN_NAME, value)
  authToken = getAuthToken()
}

export function removeAuthToken () {
  window.localStorage.removeItem(TOKEN_NAME)
  authToken = getAuthToken()
}

export function getAuthToken () {
  return window.localStorage.getItem(TOKEN_NAME)
}

export function getAuthTokenObj () {
  return {
    [TOKEN_NAME]: getAuthToken()
  }
}

const extendAxios = function (instance) {
  /**
   * 分页方法，例如：api.pagination().get()
   * @param current
   * @param pageSize
   * @returns {*}
   */
  instance.pagination = ({current = 1, pageSize = 20} = {}) => {
    return {
      get (url, config = {}) {
        config.params = {
          ...config.params,
          currentPage: current,
          pageSize
        }
        return instance.get(url, config)
      }
    }
  }
}

export function CreateApi ({baseURL, data}) {
  const headers = {}
  const params = {}
  let _axios = axios.create({
    withCredentials: false,
    baseURL,
    headers,
    params,
    data
  })

  // Add a request interceptor
  _axios.interceptors.request.use(function (config) {
    if (authToken) {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      config.params = {
        'access_token': authToken
      }
      config.data["env"] = "test-ptpuu"
    }
    // Do something before request is sent
    return config
  }, function (error) {
    // Do something with request error
    return Promise.reject(error)
  })

  /**
   * data 代表服务端标准响应
   * _response axios 的原生response对象
   */
  _axios.interceptors.response.use(function (response) {
    // Do something with response data
    let resData = response.data
    if (resData.success === false) return Promise.reject(new Error(resData.message || '逻辑异常'))
    return {data: resData, _response: response}
  }, function (error) {
    let {response} = error
    if (response.status === 401) {
      window.$vueRouter.replace('/login')
    }
    // Do something with response error
    return Promise.reject(error)
  })
  // 拓展axios实例
  extendAxios(_axios)
  return _axios
}

const globalApi = CreateApi({baseURL: NetConfig.apiBaseUrl})
export default globalApi
