<template>
  <div>
    <div id="line" style="width: 100%;height:400px;"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      myChart: null,
      xData: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月"], // 两个echarts公用的x轴的数据
      yData: [10,20,30,40,50,60,70,80,90,100],
      y1Data: [56, 64, 32, 58, 64, 76, 81,90,30,100], // 岗外
      y2Data: [88, 99, 77, 100, 21, 66, 100,100,100,100], // 灵工
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
      this.myChart = this.echarts.init(document.getElementById('line'))
      this.myChart.setOption(
        {
        color: ["#bfa", "#baf"], // 配置数据颜色
        grid: [
          // 配置第一个折线图的位置
          {
            left: "14.5%",
            right: "12%",
            top: "0%",
            height: "18%",
            borderWidth: 1,
            borderColor:['#EAEAEF','#EAEAEF','#EAEAEF','#EAEAEF']
          },
          // 配置第二个折线图位置
          {
            left: "14.5%",
            right: "12%",
            top: "18%",
            height: "18%",
            borderWidth: 1,
            borderColor:['#EAEAEF','#EAEAEF','#EAEAEF','#EAEAEF']
          },
          // 配置第三个折线图位置
          {
            left: "14.5%",
            right: "12%",
            top: "36%",
            height: "18%",
            borderWidth: 1,
            borderColor:['#EAEAEF','#EAEAEF','#EAEAEF','#EAEAEF']
          },
          // 配置第四个折线图位置
          {
            left: "14.5%",
            right: "12%",
            top: "54%",
            height: "18%",
            containerLabel:true,
            borderWidth: 1,
            borderColor:['#EAEAEF','#EAEAEF','#EAEAEF','#EAEAEF']
          },
          // 配置第五个折线图位置
          {
            left: "14.5%",
            right: "12%",
            top: "72%",
            height: "18%",
            borderWidth: 1,
            borderColor:['#EAEAEF','#EAEAEF','#EAEAEF','#EAEAEF']
          },
        ],
        tooltip: {
          trigger: "axis",
          // formatter函数动态修改tooltip样式
          formatter: function (params) {
            if (params) {
              var htmlStr = "";
              htmlStr += params[0].name.replace(/\-/g, "/") + "<br/>"; //x轴的名称
              for (var i = 0; i < params.length; i++) {
                var param = params[i]; // 存一份item项
                var seriesName = param.seriesName; //图例名称
                var value = param.value; //y轴值
                var color = param.color; //图例颜色
                htmlStr += "<div>";
                htmlStr +=
                  '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' +
                  color +
                  ';"></span>';
                //圆点后面显示的文本
                htmlStr += seriesName + "：" + value;
                switch (seriesName) {
                  case "小件货物":
                    htmlStr += " " + "件";
                    break;
                  // case "网点负荷":
                  //   htmlStr += " " + "%";
                  //   break;
                  case "大件货物":
                    htmlStr += " " + "件";
                    break;
                  default:
                    htmlStr += " ";
                }
                htmlStr += "</div>";
              }
              return htmlStr;
            } else {
              return;
            }
          },
          backgroundColor: "#ccc",
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          textStyle: {
            color: "#000",
            fontSize: 12,
            align: "left",
          },
        },
        // 将上下两个tootip合成一个
        axisPointer: {
          link: { xAxisIndex: "all" },
        },
        xAxis: [
          {
            type: "category",
            scale: false,
            axisLabel: {
              show: false,
            },
            axisLine:{
              onZero: false
            },
            offset: 0,
            axisTick: {
              alignWithLabel: false,
              show:false // 不显示坐标轴刻度线
            },
            splitLine: {
              show: false,
            },
            data: this.xData, //x轴时间的数据
          },
          {
            gridIndex: 1,
            type: "category",
            scale: false,
            axisLabel: {
              show: false,
            },
            axisTick: {
              alignWithLabel: false,
              show:false // 不显示坐标轴刻度线
            },
            splitLine: {
              show: false,
            },
            data: this.xData, //x轴时间的数据
          },
          {
            gridIndex: 2,
            type: "category",
            scale: false,
            axisLabel: {
              show: false,
            },
            axisTick: {
              alignWithLabel: false,
              show:false // 不显示坐标轴刻度线
            },
            splitLine: {
              show: false,
            },
            data: this.xData, //x轴时间的数据
          },
          {
            gridIndex: 3,
            type: "category",
            scale: false,
            axisLabel: {
              show: false,
            },
            axisTick: {
              alignWithLabel: false,
              show:false // 不显示坐标轴刻度线
            },
            splitLine: {
              show: false,
            },
            data: this.xData, //x轴时间的数据
          },
          {
            gridIndex: 4,
            type: "category",
            scale: false,
            axisLabel: {
              fontSize: 10,
            },
            axisTick: {
              alignWithLabel: false,
              show:false // 不显示坐标轴刻度线
            },
            splitLine: {
              show: false,
            },
            data: this.xData, //x轴时间的数据
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "岗外",
            nameLocation: "center",
            nameRotate: 360,
            nameGap: 20,
            nameTextStyle: {
              fontSize: 12,
              fontWeight: "500",
            },
            axisLine: {
              show: true, // 不显示坐标轴线
            },
            axisLabel: {
              show: false, // 不显示坐标轴上的文字
            },
            splitLine:{
              show:true // 不显示网格线
            },
            axisTick:{
              alignWithLabel: false,
              show:false // 不显示坐标轴刻度线
            },
            scale: false,
            boundaryGap: [0, "100%"],
            splitLine: {
              show: false,
            },
            data: this.yData
          },
          {
            type: "value",
            name: "灵工",
            nameLocation: "center",
            nameRotate: 360,
            gridIndex: 1,
            nameGap: 20,
            nameTextStyle: {
              fontSize: 12,
            },
            axisLine: {
              show: true, // 不显示坐标轴线
            },
            axisTick:{
              alignWithLabel: false,
              show:false // 不显示坐标轴刻度线
            },
            axisLabel: {
              show: false, // 不显示坐标轴上的文字
            },
            splitLine:{
              show:true // 不显示网格线
            },
            scale: false,
            boundaryGap: [0, "100%"],
            splitLine: {
              show: false,
            },
            data: this.yData
          },
          {
            type: "value",
            name: "BPO",
            nameLocation: "center",
            nameRotate: 360,
            gridIndex: 2,
            nameGap: 20,
            nameTextStyle: {
              fontSize: 12,
            },
            axisLine: {
              show: true, // 不显示坐标轴线
            },
            axisTick:{
              alignWithLabel: false,
              show:false // 不显示坐标轴刻度线
            },
            axisLabel: {
              show: false, // 不显示坐标轴上的文字
            },
            splitLine:{
              show:true // 不显示网格线
            },
            scale: false,
            boundaryGap: [0, "100%"],
            splitLine: {
              show: false,
            },
            data: this.yData
          },
          {
            type: "value",
            name: "RPO",
            nameLocation: "center",
            nameRotate: 360,
            gridIndex: 3,
            nameGap: 20,
            nameTextStyle: {
              fontSize: 12,
            },
            axisLine: {
              show: true, // 不显示坐标轴线
            },
            axisTick:{
              alignWithLabel: false,
              show:false // 不显示坐标轴刻度线
            },
            axisLabel: {
              show: false, // 不显示坐标轴上的文字
            },
            splitLine:{
              show:true // 不显示网格线
            },
            scale: false,
            boundaryGap: [0, "100%"],
            splitLine: {
              show: false,
            },
            data: this.yData
          },
          {
            type: "value",
            name: "ITO",
            nameLocation: "center",
            nameRotate: 360,
            gridIndex: 4,
            nameGap: 20,
            nameTextStyle: {
              fontSize: 12,
            },
            axisLine: {
              show: true, // 不显示坐标轴线
            },
            axisTick:{
              alignWithLabel: false,
              show:false // 不显示坐标轴刻度线
            },
            axisLabel: {
              show: false, // 不显示坐标轴上的文字
            },
            splitLine:{
              show:true // 不显示网格线
            },
            scale: false,
            boundaryGap: [0, "100%"],
            splitLine: {
              show: false,
            },
            data: this.yData
          }
        ],
        series: [
          {
            name: "小件货物",
            type: "line",
            xAxisIndex: 0,
            yAxisIndex: 0,
            hoverAnimation: true, // 悬浮的动画加上
            data: this.y1Data, //小件货物
          },
          {
            name: "大件货物",
            type: "line",
            xAxisIndex: 1,
            yAxisIndex: 1,
            hoverAnimation: true, // 悬浮的动画加上
            data: this.y2Data, //大件货物
          },
          {
            name: "大件货物",
            type: "line",
            xAxisIndex: 2,
            yAxisIndex: 2,
            hoverAnimation: true, // 悬浮的动画加上
            data: this.y2Data, //大件货物
          },
          {
            name: "大件货物",
            type: "line",
            xAxisIndex: 3,
            yAxisIndex: 3,
            hoverAnimation: true, // 悬浮的动画加上
            data: this.y2Data, //大件货物
          },
          {
            name: "大件货物",
            type: "line",
            xAxisIndex: 4,
            yAxisIndex: 4,
            hoverAnimation: true, // 悬浮的动画加上
            data: this.y2Data, //大件货物
          }
        ],
      }
      )
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
