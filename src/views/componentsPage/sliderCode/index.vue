<template>
  <div>
    <!-- 滑块组件 -->
    <slideCode :puzzleImgList="slideImageList"></slideCode>
  </div>
</template>
<script>
import slideCode from '@/components/slideCode.vue'
export default {
  name:'sliderCode',
  components:{
    slideCode
  },
  data(){
    return {
      slideImageList: []
    }
  },
  methods:{
    setSlideImageList(){
      // 随机传递一张图片
      const num = this.generateRandomInteger(0,9)
      this.slideImageList.push(require(`./image/slideCode${num}.png`))
      // 所有所有图片
      // for(let i = 0; i< 10; i++){
      //   this.slideImageList.push(require(`./image/slideCode${i}.png`))
      // }
    },
    // 获取一个范围内的随机整数数
    generateRandomInteger(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  },
  created(){
    this.setSlideImageList()
  }
}
</script>
