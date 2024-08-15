import request from '@/utils/request'

export function doPost(data){
  return request({
    url:'http://192.168.48.40:8666' + '/openSign/sign',
    method:'post',
    data: data
  })
}