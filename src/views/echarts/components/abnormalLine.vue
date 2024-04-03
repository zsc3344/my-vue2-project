<template>
  <div>
    <div id="abnormalLine" style="width: 100%;height:400px;"></div>
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
      this.myChart = this.echarts.init(document.getElementById('abnormalLine'))
      this.myChart.setOption({
        title: {
            text: '目标达成率',
            subtext: ''
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        toolbox: {
            show: true,
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['1','2','3','4','5','6','7','8','9','10','11','12']
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value}'
            },
            axisPointer: {
              snap: true
            }
        },
        visualMap: [{
          type: 'piecewise',
          show: true, 
          top: 50,
          right : 15,
          splitNumber : 12, 
          // textStyle: {
          //   color: 'red' // 设置文本颜色为红色
          // },
          pieces : [
            { gte : 150, color: 'blue', opacity:0 },
            { gte : 100 , lt: 150, color: 'blue', opacity:0 },
            // { min : 120 , max : 150 , color : 'purple' },
            // { min : 90 , max : 120 , color : 'red' },
            // { min : 60 , max : 90 , color : 'orange' },
            // { min : 25 , max : 60 , color : 'yellow' },
            { lt : 100 , color : 'red', opacity:1}         // 该范围图元以及其附属物（如文字标签）的透明度。
          ]
        }],
        series: [
          //第一部分数据
            { 
                name: '完成比',
                type: 'line',
                label: {
                  show: true,
                  position: 'top',
                  textStyle: {
                    // fontSize: 12,
                    // color: 'red'
                  }
                },
                showSymbol: true,
                smooth: false,
                data: [90,90,120,100,80]
            }
        ]
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
