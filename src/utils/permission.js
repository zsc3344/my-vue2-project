import router from '@/router/index'
import { getUserInfo, createUser } from '@/api/user'
import store from '@/store/index'
import { getToken } from '@/utils/auth'

router.beforeEach(async (to,from,next) => {
  // const userInfo = await getUserInfo()
  // await createUser({
  //   name: 'chris',
  //   age:33
  // })
  // store.dispatch('user/setUserInfo', userInfo.data.data)
  if(getToken()){
    next()
  }else{
    if(to.path === '/login'){
      next()
    }else{
      next({
        path:'/login'
      })
    }
  }
  next()
})

router.afterEach(() => {

})
