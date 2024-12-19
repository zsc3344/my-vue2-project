<template>
  <div class="pie-container">
    <div id="pie" :style="{'width': width+'px','height':height+'px'}"></div>
  </div>
</template>
<script>
export default {
  props:{
    id:{
      type:String,
      default(){
        return ''
      }
    },
    areaChartInfo:{
      type:Object,
      default(){
        return {}
      }
    }
  },
  data() {
    return {
      myChart: null,
      width: 122,
      height: 122
    }
  },
  mounted() {
    this.basicFn()
    let that = this
    window.addEventListener('resize', function() {
      that.bodyScale()
    })
  },
  methods: {
    // 等比例缩放的方法，可以放到VUE的method里 
    bodyScale() {
      // var deviceWidth = document.documentElement.clientWidth; //获取当前分辨率下的可视区域宽度
      // var scale = deviceWidth / 1920; // 分母——设计稿的尺寸
      // document.documentElement.style.zoom = scale; //放大缩小相应倍数
      // this.myChart.resize({
      //   width: this.width * scale,
      //   height: this.height * scale
      // })
      this.myChart.resize()
    },
    basicFn(){
      this.myChart = this.echarts.init(document.getElementById('pie'))
      this.bodyScale()
      let options = {
        title: {
          // text: 'Referer of a Website',
          // subtext: 'Fake Data',
          // left: 'center'
        },
        // tooltip: {
        //   trigger: 'item'
        // },
        // legend: {
        //   orient: 'vertical',
        //   left: 'left'
        // },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '70%',
            data: [
              { 
                value: 30, 
                name: '岗外',
                label: {
                  normal: {
                    show: true,
                    position:'inner', // position:'inner'在图表内部显示
                    formatter: ' {d}%' //自定义显示格式(b:name, c:value, d:百分比)
                  }
                }
              },
              { 
                value: 30, 
                name: '灵工',
                label: {
                  normal: {
                    show: true,
                    position:'inner', // position:'inner'在图表内部显示
                    formatter: ' {d}%' //自定义显示格式(b:name, c:value, d:百分比)
                  }
                }
              },
              { 
                value: 20, 
                name: 'BPO',
                label: {
                  normal: {
                    show: true,
                    position:'inner', // position:'inner'在图表内部显示
                    formatter: ' {d}%' //自定义显示格式(b:name, c:value, d:百分比)
                  }
                }
              },
              { 
                value: 10, 
                name: 'RPO',
                label: {
                  normal: {
                    show: true,
                    position:'inner', // position:'inner'在图表内部显示
                    formatter: ' {d}%' //自定义显示格式(b:name, c:value, d:百分比)
                  }
                }
              },
              { 
                value: 10, 
                name: 'ITO',
                label: {
                  normal: {
                    show: true,
                    position:'inner', // position:'inner'在图表内部显示
                    formatter: ' {d}%' //自定义显示格式(b:name, c:value, d:百分比)
                  }
                }
              }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      this.myChart.setOption(options)
    }
  }
}
</script>
<style lang="scss" scoped>
.pie-container {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
