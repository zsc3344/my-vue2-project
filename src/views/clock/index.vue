<template>
  <div class="clock-container">
    <div class="clock">
      <!-- 中心点 start -->
      <div class="origin"></div>
      <!-- 中心点 end -->
      <!-- 刻度 start -->
      <ul class="clock-line">
        <template v-for="(item, index) in 60">
          <li v-if="index % 5 == 0" :style="{ 'transform':  `rotate(${index * 6}deg) translateY(-110px)`}" class="special"></li>
          <li v-else :style="{ 'transform':  `rotate(${index * 6}deg) translateY(-110px)`}"></li>
        </template>
      </ul>
      <!-- 刻度 end -->
      <!-- 指针 start -->
      <div class="inner-clock-face">
          <i class="hour-bar" :style="{'transform': `rotate(${hoursDegress}deg)`}"></i>
          <i class="min-bar" :style="{'transform': `rotate(${minsDegress}deg)`}"></i>
          <i class="second-bar" :style="{'transform': `rotate(${secondsDegress}deg)`}"></i>
      </div>
      <!-- 指针 end -->
      <p class="label-info">Chriszhang</p>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      secondHand: null,
      hourHand: null,
      minHand: null,
      clockLine: null,
      secondsDegress: null,
      minsDegress: null,
      hoursDegress: null
    }
  },
  mounted(){
    // 设置秒针旋转的角度
    this.setTime()
    // 定时器
    setInterval(function(){
      this.setTime()
    }.bind(this), 1000)
  },
  methods:{
    setTime() {
      var now = new Date();
      // 读取秒
      var seconds = now.getSeconds();
      this.secondsDegress = (seconds / 60) * 360 + 90
      // 读取分
      var mins = now.getMinutes();
      this.minsDegress = mins * 6 + 90
      //读取时
      var hours = now.getHours();
      console.log(hours);
      this.hoursDegress = hours * 30 + 90 + (mins / 60) * 30
    }
  }
}
</script>
<style lang="scss" scoped>
.clock-container{
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(233, 233, 233);
}
.clock {
  position: relative;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  border: 7px solid #505050;
  background-color: #e7e7e7;   
  background: radial-gradient(circle at 35% 35%, #fff, rgba(212, 212, 212, 0.7), rgba(255, 255, 255, 1)); 
  box-shadow: inset 0px 0px 12px rgba(0, 0, 0, 0.3),0px 8px 12px rgba(0, 0, 0, 0.3);
  .label-info{ 
    position: absolute;
    text-align: center;
    width: 100%;
    bottom: 40px;
    font-size: 12px;
    color: #0e0e0e;
    text-shadow: 0px 1px 1px #ffffff;
  }
  // 表刻度
  .clock-line{
    position: relative;
    width: 100%;
    height: 100%; 
    padding:0px;
    margin: 0px;
      li {
          z-index: 1;
          display: block;
          width: 1px;
          height: 6px;
          background: #bdbdbd;
          position: absolute;
          top: 50%;
          left: 50%;
          margin: -3px 0 0 -1px;
      }
      .special{
        width: 2px;
        height: 8px;
        background: #333;
      }
  }
  // 表圆心
  .origin{
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 100%;
    background: #e94319; 
    left: 50%;
    top:50%;
    margin-left: -5px;
    margin-top: -5px;
    z-index: 10;
    box-shadow: 0px 3px 5px #e94319;
  }  
  // 表指针
  .inner-clock-face {
    width: 92%;
    height: 92%;
    border-radius: 50%; 
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
    border:1px dashed rgb(202, 202, 202);
    background-size: 110%;
      i {
        display: block;
        width: 50%;
        background: rgb(7, 7, 7);
        border-radius: 6px;
        position: absolute;
        top: 50%;
        right: 50%;
        transform: translateY(-50%) rotateZ(90deg);
        transform-origin: 100% center; 
      }   
      // 时针
      .hour-bar {
        width: 28%;
        height: 5px;
        box-shadow: 0px 1px 8px rgba(151, 151, 151, 0.5);
        z-index: 7;
        margin-top:-1px;
      }
      // 分针
      .min-bar {
        width: 38%;
        height: 2px;
        box-shadow: 0px 1px 8px rgba(151, 151, 151, 0.5);
        z-index: 8;
      }
      // 秒针
      .second-bar {
        width: 42%;
        height: 1px;
        background: #e94319;
        box-shadow: 0px 1px 8px rgba(233, 67, 25, 0.5);
        z-index: 9;
      }
  }
}
</style>