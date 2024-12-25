<template>
  <div class="home">
    <div class="upload-container">
      <upload />
    </div>
  </div>
</template>
<script>
import upload from '@/components/upload.vue'
export default {
  name: 'UploadFile',
  components: {
    upload
  },
  data() {
    return {
    }
  }
}
</script>
<style lang="scss" scoped>
.home{
  padding: 10px;
  .upload-container{
    // width: 200px;
  }
}
</style>
