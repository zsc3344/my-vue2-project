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
      this.myChart = this.echarts.init(document.getElementById('basic'))
      this.myChart.setOption(
      {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
        },
        textStyle: {
            color: '#466293'
        },
        legend: {
            data: ['租客分期','装修贷','周转贷','房东贷'],
            textStyle: {
                color: '#8db0ef',
                fontFamily: 'DINProRegular',
            },
            //图例标记宽高
            itemWidth: 15,
            itemHeight: 7,
            itemGap: 15,
            top: 15
        },
        //直角坐标系内绘图网格，就是柱状图距外边容器的margin值
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        yAxis: {
            type: 'value',
            name: '(个)',
            min: 0,
            max: 80,
            boundaryGap: [0, 0.1],
            //y轴文字属性设置
            axisLabel: {
                textStyle: {
                    fontSize: 16,
                    color: '#466293',
                    fontFamily: 'DINProRegular'
                },
                formatter: '{value}'
            },
            //y轴横向分割线颜色
            splitLine: {
                show: true,
                lineStyle: {
                   color: '#0c3668' 
                }
            },
            //y轴刻度线颜色
            axisTick: {
                show: false,
                lineStyle: {
                    color: '#00345c',
                } 
            },
            //y轴边框颜色
            axisLine: {
                show: false,
                lineStyle: {
                    color: '#00345c',
                } 
            }
        },
        xAxis: {
            type: 'category',
            //name: '(月)',
            data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
            axisLabel: {
                show: true,
                textStyle: {
                   //fontSize: 16,
                    color: '#466293',
                    fontFamily: 'DINProRegular'
                }
            },
            axisTick: {
                show: true,
                lineStyle: {
                    color: '#00345c',
                } 
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#00345c',
                } 
            }
        },
        series: [
            {
                name: '租客分期',
                type: 'bar',
                data: [0,7,73,34,44,46,33,6,0,0,0,0],
                itemStyle: {
                    //柱条渐变色
                    color: this.echarts.graphic.LinearGradient(
                        1, 0, 0, 1,
                        [
                            {offset: 0, color: '#0090ff'},
                            {offset: 1, color: '#0075d0'}
                        ]
                    )
                }
            },
            {
                name: '装修贷',
                type: 'bar',
                data: [0,0,0,0,0,1,1,0,1,0,0,0],
                itemStyle: {
                    //柱条渐变色
                    color: this.echarts.graphic.LinearGradient(
                        1, 0, 0, 1,
                        [
                            {offset: 0, color: '#464aff'},
                            {offset: 1, color: '#393dfe'}
                        ]
                    )
                }
            },
            {
                name: '周转贷',
                type: 'bar',
                data: [0,0,3,0,0,0,0,0,0,0,0,0],
                itemStyle: {
                    //柱条渐变色
                    color: this.echarts.graphic.LinearGradient(
                        1, 0, 0, 1,
                        [
                            {offset: 0, color: '#ffb746'},
                            {offset: 1, color: '#ffb034'}
                        ]
                    )
                }
            },
            {
                name: '房东贷',
                type: 'bar',
                data: [0,2,3,2,1,0,0,0,0,0,0,0],
                itemStyle: {
                    //柱条渐变色
                    color:this.echarts.graphic.LinearGradient(
                        1, 0, 0, 1,
                        [
                            {offset: 0, color: '#ff605f'},
                            {offset: 1, color: '#ff504f'}
                        ]
                    )
                }
            },
            
        ]
    }
      )
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
