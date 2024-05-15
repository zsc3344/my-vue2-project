<template>
  <div class="breadcumb">
      <el-breadcrumb separator="|">
        <el-breadcrumb-item v-for="(item,index) in getBreadList" :key="index" :to="item.path" :class="index === currentIndex?'active':'no-active'">{{item.meta.title}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
</template>
<script>
import store from '@/store'
export default {
  name: 'Breadcrumb',
  data(){
    return {
      breadList: store.getters.breadList,
      currentIndex:0
    }
  },
  created(){
    // this.getBreadcrumb()
  },
  //监听路由变化
  watch:{
    $route(to,from){
      console.log('===to===', to)
      this.getBreadcrumb()
      this.getBreadList.forEach((item,index) => {
        if(item.path === to.path){
          this.currentIndex = index
        }
      })
    }
  },
  created(){
    this.getBreadcrumb()
  },
  computed: {
    getBreadList(){
      console.log('===store.getters.breadList===', store.getters.breadList)
      this.currentIndex = store.getters.breadList.length-1
      return store.getters.breadList
    }
  },
  methods:{
    isHome(route){
      return route.name === 'home'
    },
    getBreadcrumb(){
      let matched = this.$route.matched
      if(matched[matched.length-1].name !== 'home'){
        let sameBreadList = this.breadList.filter(item => {
          return item.name === matched[matched.length-1].name
        })
        if(sameBreadList.length === 0){
          this.breadList.push(matched[matched.length-1])
        }
        store.commit('breadcrumb/CHANGE_BREAD_LIST',this.breadList)
      }else{
        let home = [
          {
            path:'/home',
            meta:{
              title:'首页'
            }
          }
        ]
        store.commit('breadcrumb/CHANGE_BREAD_LIST',home)
      }
    },
    // openUrl(item, index){
    //   this.currentIndex = index
    //   this.$router.push({
    //     path:item.path
    //   })
    // }
  }
}
</script>
<style scoped lang="scss">
::v-deep .el-breadcrumb__item.active{
  .el-breadcrumb__inner{
    color: #000000;
    font-weight: 600;
  }
}
::v-deep .el-breadcrumb__item.no-active {
  .el-breadcrumb__inner.is-link{
    color: #606266 !important;
    font-weight: 500 !important;
    cursor: pointer;
  }
}
</style>
