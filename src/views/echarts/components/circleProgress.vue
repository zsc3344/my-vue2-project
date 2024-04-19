<template>
  <div id="progress" :style="{'zoom':zoom,'transform': 'scale('+scale+')','width': '180px','height':'180px'}"></div>
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
      zoom: 1,
      scale:1
    }
  },
  mounted() {
    this.basicFn()
    // this.bodyScale()
    let that = this
    window.addEventListener('resize', function() {
      // that.myChart.clear()
      // that.bodyScale()
      that.myChart.resize()
    })
  },
  methods: {
    // 等比例缩放echarts图标的方法
    bodyScale() {
      const clientWidth = document.documentElement.clientWidth || document.body.clientWidth
      this.zoom = 1/(clientWidth / 1920)
      this.scale = clientWidth / 1920; // 分母——设计稿的尺寸
      window.addEventListener('resize',()=>{
        const clientWidth = document.documentElement.clientWidth || document.body.clientWidth
        this.zoom = 1/(clientWidth / 1920)
        this.scale = clientWidth / 1920; // 分母——设计稿的尺寸
      })
    },
    basicFn(){
      this.myChart = this.echarts.init(document.getElementById('progress'))
      this.myChart.setOption({
        series: [
          {
            type: 'gauge',
            startAngle: 90,
            endAngle: -270,
            pointer: {
              show: false
            },
            progress: {
              show: true,
              overlap: false,
              roundCap: false,
              clip: false,
              width: 35,
              itemStyle: {
                color: this.echarts.graphic.LinearGradient(1, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#3860F3',
                  },
                  {
                    offset: 1,
                    color: '#38A4F3',
                  },
                ]),
                borderWidth: 0,
              }
            },
            axisLine: {
              lineStyle: {
                width: 20
              }
            },
            splitLine: {
              show: false,
              distance: 0,
              length: 10
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false,
              distance: 50
            },
            data: [
              {
                value: 50,
                name: '达成率',
                title: {
                  fontSize: 16,
                  color: "#475569",
                  offsetCenter: ['0%', '-30%']
                },
                detail: {
                  fontSize: 32,
                  color: "#000000",
                  fontWeight: 500,
                  valueAnimation: true,
                  offsetCenter: ['0%', '20%']
                }
              }
            ],
            title: {
              fontSize: 14
            },
            detail: {
              width: 50,
              height: 50,
              fontSize: 14,
              color: 'inherit',
              formatter: '{value}%'
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
