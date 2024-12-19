<template>
  <div class="progress-box">
    <!-- start 进度条 -->
    <div class="cd-propgress-circle-frame">
      <div :class="{ 'cd-propgress-circle-div': true }">
        <div class="cd-propgress-circle-left-div">
          <div :class="{ 'cd-propgress-circle-left': true }"></div>
        </div>
        <div class="cd-propgress-circle-right-div">
          <div :class="{ 'cd-propgress-circle-right': true }"></div>
        </div>
      </div>
      <div class="count">{{ percentage }}%</div>
    </div>
    <!-- end 进度条 -->
    <div class="btn-box">
      <el-button @click="stopProgress">停止</el-button>
      <el-button @click="continueProgress">继续</el-button>
      <el-button @click="startProgress">重新开始</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name:'Progress',
  data(){
    return {
      leftRotate: null,
      rightRotate: null,
      widthData: 300,
      color: 'red',
      percentage: 0,
      countPercentage: null
    }
  },
  created(){
    this.setProgessCount()
  },
  watch:{
    percentage:{
      handler(newVal){
        if(newVal){
          if (newVal >= 0 && newVal <= 50) {
            this.rightRotate = (newVal / 50) * 180;
            this.leftRotate = 0;
          } else if (newVal > 50 && newVal <= 100) {
            this.rightRotate = 180;
            this.leftRotate = ((newVal - 50) / 50) * 180;
          }
        }
      },
      immediate: true
    }
  },
  methods:{
    setProgessCount(){
      this.countPercentage = setInterval(() => {
        if(this.percentage < 100){
          this.percentage += 1;
        }else{
          clearInterval(this.countPercentage)
        }
      }, 200);
    },
    startProgress(){
      this.percentage = 0
      this.setProgessCount()
    },
    continueProgress(){
      this.setProgessCount()
    },
    stopProgress(){
      clearInterval(this.countPercentage)
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.progress-box{
  display: flex;
  flex-direction: column;
}
.cd-propgress-circle-frame {
  position: relative;
  height: v-bind(widthData + "px");
  width: v-bind(widthData + "px");
  border-radius: 50%;
  border: 2px solid #ebeef5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.cd-propgress-circle-div {
  position: absolute;
  top: -2px;
  left: 0;
  display: flex;
  height: v-bind(heightData + "px");
  width: v-bind(widthData + "px");
}
.cd-propgress-circle-left-div {
  overflow: hidden;
  height: v-bind(widthData + "px");
  width: v-bind(widthData/2 + "px");
}
.cd-propgress-circle-left {
  height: v-bind(widthData + "px");
  width: v-bind(widthData + "px");
  border-radius: 50%;
  border-width: 2px;
  border-color: v-bind(color);
  border-top-color: transparent;
  border-right-color: transparent;
  border-style: solid;
  transform: v-bind("'rotate('+(-135+leftRotate)+'deg'+')'");
}
.cd-propgress-circle-right-div {
  position: relative;
  overflow: hidden;
  height: v-bind(widthData + "px");
  width: v-bind(widthData/2 + "px");
}
.cd-propgress-circle-right {
  position: absolute;
  right: 0;
  height: v-bind(widthData + "px");
  width: v-bind(widthData + "px");
  border-radius: 50%;
  border-width: 2px;
  border-color: v-bind(color);
  border-top-color: transparent;
  border-left-color: transparent;
  border-style: solid;
  transform: v-bind("'rotate('+(-225+rightRotate)+'deg'+')'");
}
.count{
  margin: 2px;
}
.btn-box{
  margin-top: 100px;
  width: 300px;
  display: flex;
  flex-direction: row;
  justify-content: center;

}
</style>
