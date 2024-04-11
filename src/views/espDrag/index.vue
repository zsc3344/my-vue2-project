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
      <div id="docContainer" class="drag" @drop="drop" @dragover.prevent>
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
    </div>
    <div class="drag-config">
      <div class="set">
        <span
          v-for="(value, key, index) in currentItem"
          :key="value.type"
          style="margin-right: 20px"
          >{{ key }}:{{ value }}({{ index }})</span
        >
        <el-input
          class="input-box"
          type="textarea"
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
  mounted(){
    this.loadPdf()
  },
  methods: {
    loadPdf() {
      let self = this;
      self.isLoading = true;
      loadPDF({
        el: "#docContainer",
        fileSrc: "https://bsl-dev.gdoss.xstore.ctyun.cn/signature/templateFile/20210906025716ssss.pdf"
      }, res => {
        self.isLoading = false
        let originPoint = ""
        // // 鼠标按下并滑动鼠标整个过程
        // function mouseDownAndMove (canvas, context, moveCall) {
        //     // 鼠标按下
        //     canvas.addEventListener("mousedown", event => {
        //         if (!self.prevCanvas[`canvas${res.index}`]) { // 没有存上一个状态的PDF的，要存一下
        //           self.prevCanvas[`canvas${res.index}`] = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
        //         }

        //         if (!self.originCanvas[`canvas${res.index}`]) { // 没有存原始PDF的 要先存一下
        //           self.originCanvas[`canvas${res.index}`] = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
        //         }

        //         if (self.mode === "variable") { // 变量模式
        //           originPoin  = getMousePos(res.canvas, event); // 获取起始点
        //         }
        //         canvas.addEventListener("mousemove", moveCall); // 开始移动鼠标了
        //     })  
        //     // 鼠标抬起
        //     canvas.addEventListener("mouseup", event => {
        //         context.putImageData(self.prevCanvas[`canvas${res.index}`], 0, 0); // 把上一个保存的PDF状态显示出来

        //         // 获取终止点，开始画矩形了
        //         if (self.mode === "variable") {
        //             let point = getMousePos(res.canvas, event); // 终止点

        //             if (point.x !== originPoint.x && point.y !== originPoint.y) { // 判断 起始点与终止点不是同一个点
        //                 paintReact(originPoint, point, context); // 画矩形

        //                 self.addTextArr({
        //                     originPoint: self.calcPoint(originPoint, point, res.scale).originPoint,
        //                     endPoint: self.calcPoint(originPoint, point, res.scale).endPoint,
        //                     scale: res.scale,
        //                     page: res.index,
        //                     value: "",
        //                     oldValue: ""
        //                 });
        //             }
        //         }
        //         canvas.removeEventListener("mousemove", moveCall); // 移除鼠标移动事件
        //     })
        // }
        // mouseDownAndMove(res.canvas, res.context, event => {
        //   res.context.putImageData(self.prevCanvas[`canvas${res.index}`], 0, 0)
        //   let point = getMousePos(res.canvas, event);
        //   if (self.mode === "variable") {
        //       paintReact(originPoint, point, res.context);
        //   }
        // })
        // if (Number(res.allPage) === Number(res.index)) { // 最后一张PDF渲染完成
        //     self.$nextTick(() => {
        //         // 获取canvas的父级div盒子，在盒子上进行签章的绘制
        //         let divList = document.getElementsByClassName("canvas-box");
        //         for (let i = 0; i <= divList.length - 1; i++) {
        //             let div = divList[i];
        //             div.addEventListener("mousedown", ev => {
        //                 let id = "";
        //                 let offsetX = ev.offsetX; // 距离div左边界的X轴距离
        //                 let offsetY = ev.offsetY; // 距离div上边界的y轴距离
        //                 if (navigator.userAgent.indexOf("Firefox") > -1) { // 兼容火狐浏览器
        //                     id = ev.originalTarget.id;
        //                     offsetX = ev.layerX;
        //                     offsetY = ev.layerY;
        //                 } else {
        //                     id = ev.toElement.id;
        //                 }
        //                 if (id === `canvas_${i + 1}`) { // 在div上的
        //                     self.signatoryMouseDown({
        //                         x: offsetX,
        //                         y: offsetY,
        //                         parentDiv: div,
        //                         i
        //                     });
        //                 } else { // 刚好在已经画好的签章上面
        //                     self.mode = `${id.split("_")[1]}Seal`;

        //                     self.signatoryList.forEach((item, index) => {
        //                         if (`sealItem${item.index}` === id.split("_")[0]) {
        //                             self.signatoryListIndex = index;
        //                         }
        //                     });
        //                 }
        //                 self.isMove = true;
        //                 div.addEventListener("mousemove", self.innerDivMouseDownAndMove); // 开始移动鼠标了
        //             })
        //             div.addEventListener("mouseup", ev => {
        //                 let id = navigator.userAgent.indexOf("Firefox") > -1 ? ev.originalTarget.id : ev.toElement.id;
        //                 self.signatoryMouseUp({
        //                     x: self.mode === "pagingSeal" ? `${div.offsetWidth - 78}px` : document.getElementById(id).style.left,
        //                     y: document.getElementById(id).style.top,
        //                     elementd: id,
        //                     res
        //                 });
        //                 self.isMove = false;
        //                 div.removeEventListener("mousemove", self.innerDivMouseDownAndMove);
        //             })
        //         }
        //     })
        // }
      })
    },
    // 获取签章内部xy坐标
    getPDFXY() {
      console.log('===x,y===', this.x, this.y)
    },
    // 内部移动事件
    move(e, item) {
      const odiv = e.target
      // 拖拽区域的宽高
      const dragEle = document.getElementById('docContainer')
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
        if (top > dragEle.clientHeight - odiv.clientHeight) {
          top = dragEle.clientHeight - odiv.clientHeight
        }
        if (left > dragEle.clientWidth - odiv.clientWidth) {
          left = dragEle.clientWidth - odiv.clientWidth
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
    width: 15%;
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
    width: 70%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f8f8fa;
    justify-content: space-around;
    .input-box {
      height: 50px;
      margin-top: 10px;
    }
    .drag { 
      overflow-x: hidden;
      overflow-y: auto;
      min-height: 90vh;
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
    #pdfCol {
      height: 100%;
      display: flex;
      align-items: flex-start;
      justify-content: space-around;
      flex-wrap: wrap;
      box-sizing: border-box;
      padding: 0 20px;
      .canvas-box {
        position: relative;
        .seal-item {
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
      .canvas {
        margin-bottom: 10px;
        border: 1px solid #333;
      }
    }
  }
  .drag-config{
    width: 15%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
::v-deep .canvas {
  margin-bottom: 10px;
  border: solid 1px #333;
}
</style>