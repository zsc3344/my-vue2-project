<template>
  <div class="breadcumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="(item,index) in getBreadList" :key="index" :to="{ path: item.path }">{{item.meta.title}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
</template>
<script>
import store from '@/store'
export default {
  name: 'Breadcrumb',
  data(){
    return {
      breadList: store.getters.breadList
    }
  },
  created(){
    // this.getBreadcrumb()
  },
  //监听路由变化
  watch:{
    $route(to,from){
      this.getBreadcrumb()
    }
  },
  computed: {
    getBreadList(){
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
    }
  }
}
</script>
