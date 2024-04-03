<template>
  <div>
    <div id="doubleBar" style="width: 100%;height:400px;"></div>
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
      this.myChart = this.echarts.init(document.getElementById('doubleBar'))
      this.myChart.setOption({
        title: {
          text: '全国数据',
          // subtext: 'Fake Data'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          show: true,
          right: 200,
          data: ['目标', '达成']
        },
        toolbox: {
          show: true,
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            // prettier-ignore
            data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
          }
        ],
        yAxis: [
          {
            name:'柱状图单位',
            nameLocation:'end',
            type: 'value'
          },
          {
            name:'折现图单位',
            nameLocation:'end',
            type: 'value',
            splitNUmber: 20,
            interval: 50
          }
        ],
        series: [
          {
            name: '目标',
            type: 'bar',
            yAxisIndex: 0,
            data: [
              100, 100, 100, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
            ],
            itemStyle:{
              color:'#165dff'
            }
            // markPoint: {
            //   data: [
            //     { type: 'max', name: 'Max' },
            //     { type: 'min', name: 'Min' }
            //   ]
            // },
            // markLine: {
            //   data: [{ type: 'average', name: 'Avg' }]
            // }
          },
          {
            name: '达成',
            type: 'bar',
            yAxisIndex: 0,
            data: [
              80, 90, 100,0,0,0,0,0,0,0,0
            ],
            itemStyle:{
              color:'#fa9550'
            }
            // markPoint: {
            //   data: [
            //     { name: 'Max', value: 182.2, xAxis: 7, yAxis: 183 },
            //     { name: 'Min', value: 2.3, xAxis: 11, yAxis: 3 }
            //   ]
            // },
            // markLine: {
            //   data: [{ type: 'average', name: 'Avg' }]
            // }
          },
          {
            name: '目标',
            type: 'line',
            yAxisIndex: 1,
            stack:'x',
            color: ["#1576d2", "#d14a82", "#26c1f2", "#a166ff", "#1271cc", "#272f67", "rgba(156, 43, 182, 1)"],
            label: {
              show: true,
              position: 'top',
              textStyle: {
                fontSize: 20
              },
              formatter: function (param) {
                return param.value + '%';
              },
              rich: {
                // 这个'value'样式表示文字颜色为白色
                value: {
                  color: '#fff',
                }
              }
            },
            data: [80, 90, 100]
          }
        ]
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
