<template>
  <div class="container">
     <wangEditor 
         ref='descriptionText' 
         v-model='formData.noticeContent' 
         height="650" 
         :maxFileSize="5 * 1024 * 1024" 
         :maxNumberOfFiles="50" 
         :maxLength="10000"
     ></wangEditor>
  </div>
</template>
<script>
import wangEditor from '@/components/wangEditor.vue'
export default {
  components:{
    wangEditor
  },
  data(){
    return {
      formData:{
        noticeContent: null          
      }        
    }    
  }
}
</script>
<style scoped lang="scss">
.container{
  width: 100%;
  height: 100%;
}
</style>