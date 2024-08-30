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
        <el-menu-item index="1" route="/home">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-submenu index="8">
          <template slot="title">
            <i class="el-icon-goods"></i>
            <span>功能库</span>
          </template>
          <el-menu-item index="9" route="/echarts">
            <i class="el-icon-s-data"></i>
            <span slot="title">Echarts使用</span>
          </el-menu-item>
          <el-menu-item index="10" route="/pdfDrag">
            <i class="el-icon-stopwatch"></i>
            <span slot="title">电子签合同拖拽方案</span>
          </el-menu-item>
          <el-menu-item index="11" route="/kaifangqian">
            <i class="el-icon-stopwatch"></i>
            <span slot="title">开放签方案</span>
          </el-menu-item>
          <el-menu-item index="12" route="/tempDrag">
            <i class="el-icon-stopwatch"></i>
            <span slot="title">模板拖拽</span>
          </el-menu-item>
          <el-menu-item index="13" route="/webSpeechApi">
            <i class="el-icon-stopwatch"></i>
            <span slot="title">语音监听并合成文字</span>
          </el-menu-item>
          <el-menu-item index="14" route="/diff">
            <i class="el-icon-stopwatch"></i>
            <span slot="title">diff插件比对使用</span>
          </el-menu-item>
          <el-menu-item index="15" route="/largeFileUpload">
            <i class="el-icon-stopwatch"></i>
            <span slot="title">大文件切片上传</span>
          </el-menu-item>
          <el-menu-item index="16" route="/combinePdf">
            <i class="el-icon-stopwatch"></i>
            <span slot="title">pdf合并</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-goods"></i>
            <span>组件库</span>
          </template>
          <el-menu-item index="1" route="/hamburger">
            <i class="el-icon-burger"></i>
            <span slot="title">汉堡动态图</span>
          </el-menu-item>
          <el-menu-item index="2" route="/uploadFile">
            <i class="el-icon-upload"></i>
            <span slot="title">文件上传</span>
          </el-menu-item>
          <el-menu-item index="3" route="/qrcode">
            <i class="el-icon-film"></i>
            <span slot="title">二维码生成</span>
          </el-menu-item>
          <el-menu-item index="4" route="/virtualScroll">
            <i class="el-icon-s-order"></i>
            <span slot="title">虚拟列表</span>
          </el-menu-item>
          <el-menu-item index="5" route="/sliderCode">
            <i class="el-icon-open"></i>
            <span slot="title">滑块验证</span>
          </el-menu-item>
          <el-menu-item index="6" route="/progress">
            <i class="el-icon-stopwatch"></i>
            <span slot="title">环形进度条</span>
          </el-menu-item>
          <el-menu-item index="7" route="/cropperImage">
            <i class="el-icon-stopwatch"></i>
            <span slot="title">图片裁剪</span>
          </el-menu-item>
          <el-menu-item index="8" route="/downloadAnimation">
            <i class="el-icon-stopwatch"></i>
            <span slot="title">下载动画</span>
          </el-menu-item>
        </el-submenu>
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
import { mapState, mapGetters } from 'vuex'
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
      return JSON.parse(localStorage.getItem('userInfo'))
    },
    userName(){
      return JSON.parse(localStorage.getItem('userInfo')).name
    },
    isLoading(){
      return store.getters.loading
    }
  },
  watch:{
  },
  created(){
    const locationHref = window.location.href
    this.currentRoute = locationHref
    this.menuOptions.forEach(item => {
      if(locationHref.includes(item.route)){
        this.defaultActive = item.index
      }
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
