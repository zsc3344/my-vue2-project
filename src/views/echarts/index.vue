<template>
  <div>
    <div class="title">Echarts图标的使用</div>  
    <div class="charts-item">
      <basic></basic>
    </div>
    <div class="charts-item">
      <pie></pie>
    </div>
    <div class="charts-item">
      <lineDemo></lineDemo>
    </div>
    <div class="charts-item">
      <liquid></liquid>
    </div>
    <div class="charts-item">
      <doubleBar></doubleBar>
    </div>
    <div class="charts-item">
      <abnormalLine></abnormalLine>
    </div>
    <div class="charts-item">
      <circleProgress></circleProgress>
    </div>
  </div>
</template>
<script>
import basic from './components/basic.vue'
import pie from './components/pie.vue'
import lineDemo from './components/line.vue'
import liquid from './components/liquid.vue'
import doubleBar from './components/doubleBar.vue'
import abnormalLine from './components/abnormalLine.vue'
import circleProgress from './components/circleProgress.vue'
export default {
  components:{
    basic,
    pie,
    lineDemo,
    liquid,
    doubleBar,
    abnormalLine,
    circleProgress
  },
  data() {
    return {
      myChart: null
    }
  },
  mounted() {
    this.basicFn()
    window.addEventListener('resize', function() {
      this.myChart.resize()
    })
  },
  methods: {
    // 入门示例
    basicFn(){
      this.myChart = this.echarts.init(document.getElementById('main'), 'dark')
      this.myChart.setOption({
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.title{
  font-size: 20px;
  margin-bottom: 30px;
}
.charts-item{
  margin: 10px;
}
</style>
