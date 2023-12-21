<template>
  <div class="home">
    <div>上传文件组件</div>
    <upload-file
    ></upload-file>
  </div>
</template>
<script>
import uploadFile from '@/components/uploadFile.vue'
export default {
  name:'UploadFile',
  components:{
    uploadFile
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
