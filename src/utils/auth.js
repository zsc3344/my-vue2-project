export function setToken(token){
  localStorage.setItem('token',token)
}
export function getToken(){
  if(localStorage.getItem('token')){
    return localStorage.getItem('token')
  }else{
    return null
  }
}
