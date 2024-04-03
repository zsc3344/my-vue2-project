<template>
  <div>
    <div id="basic" style="width: 100%;height:400px;"></div>
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
    // window.addEventListener('resize', function() {
    //   this.myChart.resize()
    // })
  },
  methods: {
    // 入门示例
    basicFn(){
      this.myChart = this.echarts.init(document.getElementById('basic'), 'dark')
      this.myChart.setOption({
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
        },
        yAxis: {},
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
            type: 'bar',
            splitArea: {
              show: true,
              interval: 0,
              areaStyle: {
                // 多类目时，可以使用数组设置颜色
                color: (
                  'rgba(51, 154, 240,0.2)',
                  'rgba(51, 154, 240,0.3)',
                  'rgba(51, 154, 240,0.4)',
                  'rgba(51, 154, 240,0.5)',
                  'rgba(51, 154, 240,0.6)',
                  'rgba(51, 154, 240,0.7)',
                  'rgba(51, 154, 240,0.8)'
                )
              }
            },
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(0,0,0,0.1)',
              borderColor: '#ce815a',
              borderType:'dashed',
              borderWidth: 1,
              shadowOffsetX:10,
              shadowOffsetY:100
            },
            axisLineIsSlot: true, // 将该属性设置为 true，可以使 x 轴的某些部分为虚线
            // 高亮样式。
            emphasis: {
              itemStyle: {
                // 高亮时点的颜色。
                color: 'blue'
              },
              label: {
                show: true,
                // 高亮时标签的文字。
                formatter: 'This is a emphasis label.'
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
