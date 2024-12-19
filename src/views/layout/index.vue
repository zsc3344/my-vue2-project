<template>
  <div class="layout">
    <div class="left-container">
      <el-menu
        mode="vertical"
        :default-active="defaultActive"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        :collapse="isCollapse"
        background-color="#363636"
        text-color="#fff"
        active-text-color="#ffd04b"
        router
        @select="selectMenu"
      >
        <div class="logo-container ">
          <img class="logo" alt="Vue logo" src="https://jrit-zl-test-1302914566.cos.ap-guangzhou.myqcloud.com/sit/2023-10-19/1697698956763-%E5%A4%A7%E9%9B%84.png">
          <span v-if="!isCollapse">ChrisZhang </span>
        </div>
        <template v-for="item in menuOptions">
          <template v-if="item.type === 'page'">
            <el-menu-item :index="item.index" :route="item.route" :key="item.index">
              <i class="el-icon-s-home"></i>
              <span slot="title">{{ item.menuName }}</span>
            </el-menu-item>
          </template>
          <template v-if="item.type === 'menu'">
            <el-submenu :index="item.index" :key="item.index">
              <template slot="title">
                <i class="el-icon-goods"></i>
                <span>{{ item.menuName }}</span>
              </template>
              <template v-if="item.children && item.children.length">
                <template v-for="childItem in item.children">
                  <el-menu-item :index="childItem.index" :route="childItem.route" :key="childItem.index">
                    <i class="el-icon-burger"></i>
                    <span slot="title">{{ childItem.menuName }}</span>
                  </el-menu-item>
                </template>
              </template>
            </el-submenu>
          </template>
        </template>
      </el-menu>
    </div>
    <div class="right-container">
      <div class="top-container">
        <div class="top-left">
          <div class="toggle">
            <Hamburger @toggle="toggle"></Hamburger>
          </div>
          <Breadcrumb></Breadcrumb>
        </div>
        <div class="top-right">
          <el-dropdown @command="handleCommand" class="dropdown">
            <el-avatar :size="30" :src="userInfo.avatarUrl"></el-avatar>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <div class="dropdown-box">
                  <el-avatar :size="30" :src="userInfo.avatarUrl"></el-avatar>
                  <span>{{ userName }}</span>
                </div>
              </el-dropdown-item>
              <el-dropdown-item command="logout">
                <div class="dropdown-box">
                  退出登陆
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="content-container">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
import { menuOptions } from '@/staticData'
import Hamburger from '@/components/hamburger.vue'
import Breadcrumb from '@/components/breadcrumb.vue'
import store from '@/store'
export default {
  name:'Layout',
  components: {
    Hamburger,
    Breadcrumb
  },
  data(){
    return {
      menuOptions,
      isCollapse: true,
      windowHeight:0,
      pageHeight: 0,
      defaultActive:'0',
      currentRoute: ''
    }
  },
  computed:{
    userInfo(){
      return JSON.parse(localStorage.getItem('userInfo')) || {
        "userName": "chris",
        "name": "张上川",
        "age": 33,
        "gender": "男",
        "avatarUrl": "https://jrit-zl-test-1302914566.cos.ap-guangzhou.myqcloud.com/sit/2023-10-19/1697698956763-%E5%A4%A7%E9%9B%84.png",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImNocmlzIiwiaWF0IjoxNzE5NTc0NzYwLCJleHAiOjE3MTk2NjExNjB9.8IoQf3g5XDPzuaj5veXz7pAhKm8bet49eIAW4Z7T8Ag"
      }
    },
    userName(){
      return JSON.parse(localStorage.getItem('userInfo')).name || '张上川'
    },
    isLoading(){
      return store.getters.loading
    }
  },
  watch:{
  },
  created(){
    const locationHref = window.location.href
    console.log('===locationHref.split(#)===', locationHref.split('#'))
    const locationHrefArr = locationHref.split('#')
    const splitRoute = locationHref.split('#')[locationHrefArr.length - 1]
    this.currentRoute = locationHref
    console.log('===currentRoute===', this.currentRoute)
    this.menuOptions.forEach(item => {
      if(splitRoute === item.route){
        this.defaultActive = item.index
      }else{
        if(item.children && item.children.length){
          item.children.forEach(childItem => {
            // console.log('===locationHref===', locationHref)
            // console.log('===childItem.route===', childItem.route)
            // console.log('===locationHref.indexOf(childItem.route)===', locationHref.indexOf(childItem.route))
            if(splitRoute === childItem.route){
              console.log('===111 childItem.index===', childItem.index)
              this.defaultActive = childItem.index
            }
          })
        }
      }
      console.log('===this.defaultActive===', this.defaultActive)
    })
  },
  mounted(){
    window.onresize = () => {
      return (() => {
        this.pageHeight = document.documentElement.clientHeight //获取到的高度 document.documentElement.clientHeight;
      })()
    };
  },
  methods:{
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    selectMenu(index, indexPath){
      this.defaultActive = index
    },
    toggle(){
      this.isCollapse = !this.isCollapse
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    logout(){
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      this.$store.dispatch('user/setUserInfo', {})
      this.$router.push({
        path:'/login'
      })
    },
    handleCommand(command){
      if(command === 'logout'){
        this.logout()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.layout{
  display: flex;
  flex-direction: row;
  position: relative;
  width: 100%;
  height: 100%;
  .left-container{
    background-color: #363636;
  }
  .logo-container{
    width: 100%;
    height: 60px;
    background-color: #363636 !important;
    color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: width 1s linear 2s;
    -webkit-transtion:width 1s linear 2s;
    .logo{
      width: 20px;
      margin-right: 5px;
    }
  }
  .el-menu-vertical-demo{
    overflow-x: hidden;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 5px;
      height: 20px;
    }
    &::-webkit-scrollbar-thumb {
      background-color:#444445;
      border-radius: 10px;
      height: 20px;
    }
    .link-name{
      color: #ffffff;
      text-decoration: none;
    }
  }
  .el-menu-vertical-demo.el-menu--collapse {
    width: 200px;
    min-height: 400px;
    // position: fixed;
    top: 0px;bottom: 0;left: 0;
    width: 64px;
    height: 100%;
    background-color: #363636;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
    // position: fixed;
    top: 0px;bottom: 0;left: 0;
    height: 100%;
    background-color: #363636;
  }
  :deep(.el-menu) {
    border-right: none;
  }
  .right-container{
    position: relative;
    overflow-y: auto;
    flex: 1;
    .top-container{
      position: sticky;
      top: 0;right: 0;
      z-index: 1000;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 50px;
      background-color: #f6f7fb;
      .toggle{
        padding: 10px;
      }
      .top-left{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }
      .top-right{
        margin-right: 10px;
      }
    }
    .content-container{
      padding: 20px;
      // margin-top: 50px;
      height: calc(100% - 50px);
    }
  }
}

:deep(.el-dropdown-menu){
  padding: 0px !important;
  margin: 0px !important;
  background-color: #ecf5ff !important;
}
:deep(.el-dropdown-menu__item){
  padding: 0px !important;
  margin: 0px !important;
  background-color: #ecf5ff !important;
}
:deep(.el-dropdown-menu__item):hover {
  background-color: #ebeffe !important;
  color: #000000 !important;
}
:deep(.dropdown-box){
  width: 120px;
  height: 50px;
  padding: 0 10px !important;
  background-color: #f4f8fd;
  display: flex;
  flex-direction: row;
  align-items: center;
  span{
    margin-left: 10px;
    font-weight: 600;
  }
}
</style>
