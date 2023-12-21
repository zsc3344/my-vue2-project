import request from '@/utils/request'

// 查询用户信息
export function getUserInfo(){
  return request({
    url:'/getUserInfo',
    method:'get'
  })
}

// 根据id查询用户信息
export function getUserInfoById(params){
  return request({
    url:'/getUserById',
    method:'get',
    params: params
  })
}

// 创建用户信息
export function createUser(data){
  return request({
    url:'/createUser',
    method:'post',
    data: data
  })
}

