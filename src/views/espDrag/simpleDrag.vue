<template>
  <div class="all">
    <!-- 给需要拖拽的对象设置可拖拽属性 -->
    <div class="drag-item">
      <div
        class="oneDiv"
        draggable="true"
        @dragstart="dragstart($event, item)"
        @dragend="dragend"
        v-for="(item, index) in dragList"
        :key="index"
      >
        {{ item.name }}
      </div>
    </div>
    <div class="drag-box">
      <div class="drag" @drop="drop" @dragover.prevent>
        <div
          :class="['box', item.selectName]"
          @mousedown="move($event, item)"
          @click="getModel(item)"
          v-for="(item, index) in dropData"
          :key="index"
          :style="{ width: item.width + 'px', height: item.height + 'px', left: item.left + 'px', top: item.top + 'px' }"
        >
          {{ item.value }}
          {{ item.model }}
        </div>
      </div>
      <div class="set">
        <span
          v-for="(value, key, index) in currentItem"
          :key="value.type"
          style="margin-right: 20px"
          >{{ key }}:{{ value }}索引({{ index }})</span
        >
        <el-input
          class="input-box"
          v-model="curretnInput"
          placeholder=""
          @change="setModel"
        ></el-input>
      </div>
      <el-button @click="getPDFXY">获取pdf内坐标</el-button>
    </div>
  </div>
</template>
 
<script>
import {
    loadPDF,
    getMousePos,
    paintReact,
    paintText
} from "@/utils/canvas"
export default {
  data() {
    return {
      // 拖拽数据
      dropData: [],
      // 参数数据(可拖拽多个)
      dragList: [
        {
          name: '设置公司签章',
          value:'我方公司签章',
          width: 159,
          height: 159,
          left: 0,
          top: 0,
          type: 1,
          model: ''
        },
        {
          name: '设置签名',
          value:'我方签名',
          width: 150,
          height: 59,
          left: 0,
          top: 0,
          type: 2,
          model: ''
        },
        {
          name: '设置日期',
          value:'我方日期',
          width: 104,
          height: 26,
          left: 0,
          top: 0,
          type: 3,
          model: ''
        }
      ],
      // 拖动的当前对象
      currentItem: {},
      curretnInput: '',
      currentName: '',
      // 位置xy
      x: '',
      y: ''
    }
  },
  computed: {},
  methods: {
    // 获取签章内部xy坐标
    getPDFXY() {
      console.log('===x,y===', this.x, this.y)
    },
    // 内部移动事件
    move(e, item) {
      const odiv = e.target
      // 算出鼠标相对元素的位置
      const disX = e.clientX - odiv.offsetLeft
      const disY = e.clientY - odiv.offsetTop
      // 鼠标按下拖动
      document.onmousemove = e => {
        let left = e.clientX - disX
        let top = e.clientY - disY
        // 设置边距限制
        if (top <= 0) {
          top = 0
        }
        if (top >= 500 - 100) {
          top = 500 - 100
        }
        if (left >= 1000 - 100) {
          left = 1000 - 100
        }
        if (left <= 0) {
          left = 0
        }
 
        // 拖拽位置设定
        item.left = left
        item.top = top
 
        // 获取位置
        // 500 容器高度 50 印章一半距离
        this.x = left + 50
        this.y = 500 - top - 50
      }
      // 移除
      document.onmouseup = e => {
        document.onmousemove = null
        document.onmouseup = null
      }
    },
    dragstart(e, item) {
      // 将拖拽对象的参数传递给拖拽存放地
      e.dataTransfer.setData('item', JSON.stringify(item))
    },
    dragend(e) {
      // 清除
      e.dataTransfer.clearData()
    },
    // 拖拽事件，获取参数
    drop(e) {
      console.log(e)
      // 获取拖拽对象的参数
      let data = e.dataTransfer.getData('item')
      data = JSON.parse(data)
      // 鼠标落点位置相对于当前拖拽存放地的 x y
      data.left = e.layerX
      data.top = e.layerY
      // 存放到当前拖拽对象生成的列表中
      this.dropData.push(data)
      console.log(this.dropData)
    },
    // 获取参数
    getModel(item) {
      this.dropData = this.dropData.map(item => {
        item.selectName = ''
        return item
      })
      console.log(this.dropData)
      console.log(this.dragList)
      item.selectName = 'select'
      this.curretnInput = item.model
      this.currentItem = item
    },
    // 设置input输入
    setModel() {
      this.currentItem.model = this.curretnInput
    }
  }
}
</script>
 
<style lang="scss" scoped>
.all {
  display: flex;
  overflow: hidden;
  .drag-item{
    display: flex;
    flex-direction: column;
    .oneDiv {
      width: 100px;
      height: 30px;
      background-color: #409eff;
      text-align: center;
      margin: 10px;
      line-height: 30px;
      cursor: pointer;
      color: #ffffff;
      border-radius: 5px;
      font-size: 12px;
    }
  }
  .drag-box{
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .input-box {
      width: 100%;
      height: 50px;
      margin-top: 10px;
    }
    .drag {
      overflow: hidden;
      width: 1000px;
      height: 700px;
      // max-height: 98vh;
      // overflow: hidden;
      // overflow-y: auto;
      border: solid 1px #000000;
      position: relative;
      .box {
        position: absolute;
        top: 0px;
        left: 0px;
        background: #eff9fe;
        user-select: none;
        border: dashed 1px #666666;
        cursor: pointer;
        font-size: 14px;
        display: flex;
        justify-content: center;
        align-items: center;

      }
      .select {
        background: white;
      }
    }
  }
  .pdf-box {
    max-height: 90vh;
    overflow: hidden;
    overflow-y: auto;
    .pdfCol{
      height: 100%;
      display: flex;
      align-items: flex-start;
      justify-content: space-around;
      flex-wrap: wrap;
      box-sizing: border-box;
      padding: 0 20px;
      .canvas-box{
        position: relative;
        .seal-item{
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
          font-size: 14px;
          border: 1px dashed #666;
          background-color: rgba(235, 247, 254, .8);
          cursor: move;
          text-align: center;
        }
      }
    }
  }
}
::v-deep .canvas {
  margin-bottom: 10px;
  border: solid 1px #333;
}
</style>