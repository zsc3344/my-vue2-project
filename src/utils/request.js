// 引入axios对象
import axios from 'axios'
import store from '@/store/index'
import { Notification } from 'element-ui'

// 设置默认请求头
axios.defaults.headers['Content-Type'] = 'application/json'
// 获取环境变量
const NODE_ENV = process.env.NODE_ENV

let baseUrl = ''
if(NODE_ENV === 'development'){
  baseUrl = 'http://127.0.0.1:7001/api'
}

// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL:baseUrl,
  // 超时
  timeout:60000
})

// request请求拦截器设置
service.interceptors.request.use(config => {
  if(config.url.indexOf('login') === -1){
    config.headers.csrftoken = localStorage.getItem('token') || ''
  }
  return config
})

// response响应拦截器
service.interceptors.response.use(res => {
  const code = res.data.code
  const msg = res.data.msg
  if(code !== 200){
    Notification.error({
      title: msg
    });
    return Promise.reject('error');
  }else{
    return res
  }
})

export default service



