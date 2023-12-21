<template>
  <div class="home">
    <div>首页</div>
  </div>
</template>
<script>
export default {
  name:'Home',
  data(){
    return {
      count:0,
      testCount: 0
    }
  },
  created() {

  },
  methods:{
    addCount(){
      let newCount = 9999999999
      this.testCount = newCount
      this.count = this.count+1
    }
  },
  computed:{
    totalCount(){
      return this.count
    }
  }
}
</script>
<style lang="scss" scoped>
.home{
  padding: 10px;
}
</style>
