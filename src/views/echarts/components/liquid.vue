<template>
  <div>
    <div id="liquidFill" style="width: 100%;height:400px;"></div>
  </div>
</template>
<script>
import "echarts-liquidfill";
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
      this.myChart = this.echarts.init(document.getElementById('liquidFill'), 'dark')
      this.myChart.setOption({
        title: {
          text: 'ECharts 水球图'
        },
        series: [
          {
            name: '年度进度',
            type: 'liquidFill',
            stack:'x',
            label: {
              show: true,
              position: 'bottom',
              textStyle: {
                fontSize: 20,
                color: '#1D2129'
              }
            },
            data: [
              {
                name: 'score',
                direction: 'right',
                value: 0.09,
                itemStyle: {
                  // opacity: 0.55,
                  normal: {
                    fontSize: 12,
                    color: '#2c6cff',
                  }
                },
              },
              // {
              //   name: 'scores',
              //   direction: 'right',
              //   value: 0.69,
              //   itemStyle: {
              //     opacity: 0.55,
              //     normal: {
              //       color: '#134892'
              //     }
              //   }
              // },
              // {
              //   name: 'scorex',
              //   direction: 'right',
              //   value: 0.09,
              //   itemStyle: {
              //     opacity: 1,
              //     normal: {
              //       color: '#bacfff'
              //     }
              //   }
              // }
            ],
            backgroundStyle: {   // 设置水球图内部背景色
              borderColor: '#165dff',
              borderWidth: 10,
              color: "#ffffff",//水球图内部背景色
            },
            itemStyle: {
              opacity: 0.55,
              // shadowBlur: 50,
              // shadowColor: 'rgba(0, 0, 0, 0.4)',
            },
            label: {   // 设置百分比展示
              color: '#1D2129',
              normal: {
                textStyle: {
                  fontSize: 40,
                },
                formatter: function (param) {
                  return param.value * 100 + '%';
                }
              }
            },
            outline: { // 是否显示外圈
              show: false
            }
          }
        ]
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
