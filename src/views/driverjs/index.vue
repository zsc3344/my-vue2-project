<template>
  <div class="container">
    <p>《I LOVE YOU TOO》。漫画作者 CHOW HON LAM，马来西亚漫画家、插画家。</p>
    <div>
      <button id="story1" @click="openDriver">故事1</button>
    </div>
    <div id="tour1" class="tour" :class="tourDisplay === 'none'?'tour1-none':'tour1-inlineBlock'">
      <img width="500" height="auto" :src="imgUrl" />
      <div class="crocodile1"></div>
      <div class="koala1"></div>
    </div>
  </div>
</template>
<script>
import { driver } from "driver.js"
import "driver.js/dist/driver.css"

export default {
  data(){
    return {
      imgUrl: require('@/assets/crocodile.png'),
      tourDisplay:'none'
    }
  },
  methods:{
    openDriver(){
      this.tourDisplay = 'inlineBlock'
      const driverObj = driver({
        showProgress: true,
        allowClose: false,
        steps: [
          { element: '.crocodile1', popover: { description: '这里有一只鳄鱼', side: "left", align: 'start' } },
          { element: '.koala1', popover: { description: '这里有三只考拉', side: "bottom", align: 'start' } },
          { element: '#tour1', popover: { description: '这是他们的故事《另一把雨伞》', side: "bottom", align: 'start' } }
        ]
      });
      driverObj.drive()
    }
  }
}
</script>
<style scoped lang="scss">
.container{
  #tour1 {
    position: relative;
    margin-top: 32px;
  }
  .tour1-none {
    display: none;
  }
  .tour1-inlineBlock {
    display: inline-block;
  }

  .crocodile1 {
    position: absolute;
    left: 245px;
    top: 35px;
    width: 140px;
    height: 130px;
  }

  .koala1 {
    position: absolute;
    left: 145px;
    top: 130px;
    width: 100px;
    height: 30px;
  }
}
</style>