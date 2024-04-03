<template>
  <div>
    <div id="line" style="width: 100%;height:400px;"></div>
  </div>
</template>
<script>
export default {
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
      this.myChart = this.echarts.init(document.getElementById('line'), 'dark')
      this.myChart.setOption({
        title: {
          text: 'ECharts 折线图'
        },
        tooltip: {},
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '销量',
            type: 'line',
            stack:'x',
            label: {
              show: true,
              position: 'bottom',
              textStyle: {
                fontSize: 20
              }
            },
            data: [5, 20, 36, 10, 10, 20]
          },
          {
            name: '销量',
            type: 'line',
            stack:'x',
            label: {
              show: true,
              position: 'bottom',
              textStyle: {
                fontSize: 20
              }
            },
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
