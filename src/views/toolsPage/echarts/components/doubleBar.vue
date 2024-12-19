<template>
  <div class="bar-charts">
    <div :id="id" class="bar-charts-box" :style="{'zoom':zoom, 'transform': 'scale('+scale+')', 'transform-origin':'0 0', 'width': '100%','height':'300px'}"></div>
  </div>
</template>
<script>
export default {
  props:{
    id:{
      type:String,
      default(){
        return 'doubleBar'
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
      zoom: null,
      scale: null,
      yData: [10,20,30,40,50,60,70,80,90,100],
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
      window.addEventListener('resize',(event)=>{
        const clientWidth = document.documentElement.clientWidth || document.body.clientWidth
        this.zoom = 1/(clientWidth / 1920)
        this.scale = clientWidth / 1920; // 分母——设计稿的尺寸
      })
    },
    basicFn(){
      this.myChart = this.echarts.init(document.getElementById(this.id))
      let unit = '月'
      let lineInfo = [10,20,30,40,50,60,70,80,90,100]
      // 根据达成率计算得到区域低于100%的柱状图区域背景色
      let colorArr = lineInfo.map(item => {
        return item < 100 || !item ? '#D82A2A' : ''
      })
      let barUnit = '亿元'
      this.myChart.setOption({
        grid: [
          // 配置第一个折线图的位置
          {
            show: true,
            left: "50px",
            right: "0",
            top: "30px",
            height: "70",
            borderWidth: 0
          },
          {
            top: '100px',   // 上边距
            bottom: '20px',   // 下边距
            left: '50px',   // 左边距
            right: '0px'   // 右边距
          }
        ],
        title: {
          text: '数据',
          textStyle:{
            color: "#000000",
            fontSize: 16,
            fontWeight: 600
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          show: true,
          left: 100,
          data: ['目标', '达成','完成度'],
          itemWidth: 12,
          itemHeight: 12,
          itemGap: 30,
          textStyle:{
            fontSize: 14,
            lineHeight: 14,
            rich: {
              a: {
                verticalAlign: 'middle'
              }
            }
          }
        },
        toolbox: {
          show: true
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            scale: false,
            show: false,
            axisLabel: {
              show: false,
            },
            axisLine:{
              onZero: false,
              lineStyle:{
                color: '#EAEAEF'
              }
            },
            offset: 0,
            axisTick: {
              alignWithLabel: false,
              show:false // 不显示坐标轴刻度线
            },
            splitLine: {
              show: false,
            },
            data: ['华东', '华南', '中西', '华北'], //x轴时间的数据
          },
          {
            gridIndex: 1,
            type: 'category',
            axisLabel: {
              fontSize: 10,
              color: "#949DAA",
              formatter: function (value, index) {
                return value + unit
              },
              textStyle: {
                color: function (value, index) {
                  return '#D82A2A'
                }
              }
            },
            splitArea:{
              show: true,
              areaStyle:{
                color:colorArr,
                opacity:0.1,
                shadowOffsetY: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                shadowBlur: 10
              }
            },
            data: ['华东', '华南', '中西', '华北'], //x轴时间的数据
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "",
            axisLine: {
              show: false, // 不显示坐标轴线,
              lineStyle:{
                color: '#EAEAEF'
              }
            },
            axisLabel: {
              show: false, // 不显示坐标轴上的文字
            },
            splitLine:{
              show:false // 不显示网格线
            },
            axisTick:{
              alignWithLabel: false,
              show:false // 不显示坐标轴刻度线
            },
            scale: false,
            boundaryGap: [0, "100%"],
            data: this.yData
          },
          {
            gridIndex: 1,
            name:'',
            nameLocation:'end',
            type: 'value',
            splitLine:{
              show:true,
              lineStyle:{
                type:'dashed',
                color: "#EDF2F7"
              }
            },
            axisLabel: {
              formatter: function (value, index) {
                return value + barUnit
              }
            },
            data: this.yData
          },

        ],
        series: [
          // 折线图
          {
            name: '完成度',
            type: 'line',
            xAxisIndex: 0,
            yAxisIndex: 0,
            stack:'x',
            color: ["#1576d2", "#d14a82", "#26c1f2", "#a166ff", "#1271cc", "#272f67", "rgba(156, 43, 182, 1)"],
            label: {
              show: true,
              position: 'top',
              textStyle: {
                fontSize: 12,
                fontWeight: 600,
                color: '#29B659'
              },
              formatter: function (param) {
                return param.value + '%';
              },
              rich: {
                // 这个'value'样式表示文字颜色为白色
                value: {
                  color: '#29B659',
                }
              }
            },
            lineStyle:{
              color:"#29B659",
              width: 2
            },
            itemStyle: {
              color: "#29B659", //改变折线点的颜色
            },
            data: [10,20,30,40,50,60,70,80,90,100],
          },
          {
            name: '目标',
            gridIndex: 1,
            type: 'bar',
            barWidth: '16',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: [10,20,30,40,50,60,70,80,90,100],
            label:{
              show:true,
              position:'top',
              color: "#3860F3",
              fontSize: 12,
              fontWeight: 600,
              offset:[0,4]
            },
            itemStyle:{
              color:'#3860F3'
            }
          },
          {
            name: '达成',
            gridIndex: 1,
            type: 'bar',
            barWidth: '16',
            barCategoryGap: "3.88",
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: [10,20,30,40,50,60,70,80,90,100],
            label:{
              show:true,
              position:'top',
              color: "#FF9C41",
              fontSize: 12,
              fontWeight: 600,
              offset:[0,4]
            },
            itemStyle:{
              color:'#FF9C41'
            }
          }
        ]
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.bar-charts{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .charts-title{
    font-size: 20px;
    line-height: 28px;
    color: #1d212d;
    margin-left: 20px;
  }
  .bar-charts-box{
    display: flex;
    justify-content: flex-start;
  }
}
</style>
