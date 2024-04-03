<template>
  <div class="home">
    <upload
    ></upload>
  </div>
</template>
<script>
import upload from '@/components/upload.vue'
export default {
  name:'UploadFile',
  components:{
    upload
  },
  data(){
    return {
    }
  }
}
</script>
<style lang="scss" scoped>
.home{
  padding: 10px;
}
</style>
