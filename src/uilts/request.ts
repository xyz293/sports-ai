import axios from 'axios'
import { config } from './config'
import {getToken} from './tools'
const request = axios.create({
  baseURL:config.baseURL,
  timeout:config.timeout
})
// 添加请求拦截器
const map = new Map()
request.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    const token = getToken()
    if(token){
        config.headers['Authorization'] = `Bearer ${token}`
    }
    const control =new AbortController()
    config.signal = control.signal
     const key = `${config.url}${config.method}`
   if(map.has(key)){
   
    map.delete(key)
   }
    map.set(key,control)
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
request.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    const key = `${response.config.url}${response.config.method}`
    map.delete(key)
    return response;
  }, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    const key = `${error.config.url}${error.config.method}`
    map.delete(key)
    return Promise.reject(error);
  });
export default request