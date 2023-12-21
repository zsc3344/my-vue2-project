import request from '@/utils/request'

export function uploadFile(data){
  return request({
    url:'/uploadFile',
    method:'post',
    data: data
  })
}
