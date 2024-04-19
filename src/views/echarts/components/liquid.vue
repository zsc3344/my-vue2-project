<template>
  <div>
    <div id="liquidFill" style="width: 200px;height:200px;"></div>
  </div>
</template>
<script>
import "echarts-liquidfill";
export default {
  props: {
    percentValue: {
      type: String | Number,
      default: 30
    }
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
      this.myChart = this.echarts.init(document.getElementById('liquidFill'))
      this.myChart.setOption({
        tooltip: {
          show: true
        },
        title: {
          // text: 'ECharts 水球图'
        },
        series: [
          {
            type: 'liquidFill',
            stack:'x',
            radius: '90%',
            data: [
              {
                name: '年度进度',
                direction: 'right',
                value: (this.percentValue/100).toFixed(2),
                itemStyle: {
                  color: '#d5f8f7'
                }
              },
              {
                name: '年度进度',
                direction: 'right',
                value: (this.percentValue/100).toFixed(2),
                itemStyle: {
                  color: this.echarts.graphic.LinearGradient(1, 0, 0, 1, [{
                    offset: 0,//0%时的颜色 从上往下看 最上面是0%
                    color: '#80E3FF'
                  }, {
                    offset: 1,//100%时的颜色 从上往下看 最上面是0%
                    color: '#35FED0'
                  }],)
                },
              },
              // {
              //   name: '',
              //   direction: 'right',
              //   value: 0.2,
              //   itemStyle: {
              //     opacity: 0.55,
              //     normal: {
              //       color: '#d5f8f7'
              //     }
              //   }
              // },
              // {
              //   name: '',
              //   direction: 'right',
              //   value: this.contentInfo.amount,
              //   itemStyle: {
              //     opacity: 0.55,
              //     normal: {
              //       color: '#2c6cff'
              //     }
              //   }
              // }
            ],
            backgroundStyle: {   // 设置水球图内部背景色
              color: "#f6f9fd", //水球图内部背景色
            },
            itemStyle: {
              // opacity: 0.55,
              // shadowBlur: 50,
              // shadowColor: 'rgba(0, 0, 0, 0.4)',
            },
            label: {   // 设置百分比展示
              // color: '#1D2129',
              normal: {
                textStyle: {
                  fontSize: 16,
                  color: '#1D2129',
                  fontWeight: 'bold'
                },
                formatter: function (param) {
                  return (param.value * 100).toFixed(0)+ '%';
                }
              }
            },
            outline: { // 是否显示外圈
              show: true,
              width: 2,
              borderDistance: 14,
              itemStyle:{
                //外边框样式
                borderWidth: 2, //边框宽度
                borderColor: this.echarts.graphic.LinearGradient(1, 0, 0, 1, [{
                  offset: 0,//0%时的颜色 从上往下看 最上面是0%
                  color: '#80E3FF'
                }, {
                  offset: 1,//100%时的颜色 从上往下看 最上面是0%
                  color: '#35FED0'
                }],),
                shadowBlur: 0, //波浪的阴影范围
              }
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
