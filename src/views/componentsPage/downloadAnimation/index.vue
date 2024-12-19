<template>
  <div class="flip-container">
    <el-button type="primary" @click="clickDownload">点击下载</el-button>
    <el-button v-if="downloadStatus" class="file animation" type="primary" :plain="!downloadStatus" circle icon="el-icon-download" @click="openDownload"></el-button>
    <el-button :key="downloadStatus" class="download" type="primary" :plain="!downloadStatus" circle icon="el-icon-download" @click="openDownload"></el-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      downloadStatus: false
    }
  },
  methods:{
    clickDownload(){
      this.downloadStatus = true
    },
    openDownload(){
      this.downloadStatus = false
      console.log('===this.downloadStatus===', this.downloadStatus)
    }
  }
}
</script>
<style scoped lang="scss">
.flip-container{
  .file{
    visibility: hidden;
    position: absolute;
    right: 20px;
    top: 50%;
    width: 50px;
    height: 50px;
    text-align: center;
    vertical-align: middle;
    border: 1px solid #f2f2f2;
    border-radius: 50%;
    position: absolute;
    animation-name: myAnimation;
    animation-duration: 0.8s;
    animation-timing-function: linear;
    animation-iteration-count: 1;
    animation-direction: normal;
    animation-play-state: running;
  }
  .download{
    width: 50px;
    height: 50px;
    position: fixed;
    bottom: 20px;
    right: 20px;
    border: solid 1px #f2f2f2;
    border-radius: 30px;
    text-align: center;
    vertical-align: middle;
  }
}
@keyframes myAnimation {
    0% {
      visibility:visible;
      right: 20px;
      top: 50%;
        transform: translate(0) translateY(0);
    }
    // 25% {
    //     top: 10%;
    //     left: 30%;
    //     transform: translateX(0) translateY(-100%);
    // }
    // 50% {
    //     top: 30%;
    //     left: 50%;
    //     transform: translateX(-100%) translateY(-100%);
    // }
    // 75% {
    //     top: 50%;
    //     left: 75%;
    //     transform: translateX(-100%) translateY(0);
    // }
    100% {
        right: 20px;
        top: calc(100% - 50px);
        position: absolute;
        z-index: 1;
        transform: translateX(0) translateY(0);
    }
}
</style>