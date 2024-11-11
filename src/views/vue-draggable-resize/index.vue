<template>
  <div class="container">
    <div class="control-box">

    </div>
    <div class="drag-box">
      <h1>vue-draggable-resizable插件使用</h1>
      <p class="desc">功能：你可以进行拖拽和移动</p>
      <div class="position">
        <div class="position-item">
          <h5>控件一：</h5>
          <span>X坐标为: {{ x1 }};Y坐标为: {{ y1 }}；宽为: {{ w1 }} ;高为: {{ h1 }}</span>
        </div>
        <div class="position-item">
          <h5>控件二：</h5>
          <span>X坐标为: {{ x2 }};Y坐标为: {{ y2 }}；宽为: {{ w2 }} ;高为: {{ h2 }}</span>
        </div>
      </div>
      <div class="parent-class">
        <vdr 
          :w="w1"
          :h="h1"
          :x="x1"
          :y="y1"
          :min-width="200" 
          :min-height="50" 
          v-on:dragging="onDrag1"
          v-on:resizing="onResize1"
          :parent="true"
          parent=".parent-class"
          :isConflictCheck="true"
          :snap="true"
          :snap-tolerance="5"
          :maximize="true"
          :grid="[1,1]"
          :draggable="true"
          drag-handle=".draggable"
        >
          <div class="draggable">控件一</div>
        </vdr>
        <vdr 
          :w="w2"
          :h="h2"
          :x="x2" 
          :y="y2"
          :min-width="200"
          :min-height="50"
          v-on:dragging="onDrag2"
          v-on:resizing="onResize2"
          :parent="true"
          parent=".parent-class"
          :isConflictCheck="true"
          :snap="true"
          :snap-tolerance="5"
          :maximize="true"
          :grid="[1,1]"
          :draggable="true"
          drag-handle=".draggable"
        >
          <div class="draggable">控件二</div>
        </vdr>
      </div>
    </div>
  </div>
</template>
<script>
import draggable from 'vuedraggable';

export default {
  data() {
    return {
      w1: 200,
      h1: 50,
      x1: 500,
      y1: 200,

      w2: 200,
      h2: 50,
      x2: 1000,
      y2: 200
    }
  },
  methods: {
    onResize1: function (x, y, width, height) {
      this.x1 = x
      this.y1 = y
      this.w1 = width
      this.h1 = height
    },
    onDrag1: function (x, y) {
      this.x1 = x
      this.y1 = y
    },
    onResize2: function (x, y, width, height) {
      this.x2 = x
      this.y2 = y
      this.w2 = width
      this.h2 = height
    },
    onDrag2: function (x, y) {
      this.x2 = x
      this.y2 = y
    }
  }
}
</script>
<style scoped lang="scss">
.container{
  display: flex;
  height: 100%;
  .control-box{
    width: 200px;
  }
  .drag-box{
    width: 100%;
    height: 700px;
    .vdr{
      border-width: 0.511797px;
      border-color: rgb(25, 178, 119);
      background-color: rgba(25, 178, 119, 0.12);
      border-radius: 4.09437px;
    }
    .desc{
      margin-top: 10px;
    }
    .position{
      margin-top: 20px;
      width: 100%;
      display: flex;
      justify-content: space-around;
      .position-item{
        width: 50%;
        display: flex;
        flex-direction: column;
      }
    }
    .parent-class{
      height: 700px; 
      width: 100%; 
      border: 1px solid red; 
      position: relative;
      margin-top: 20px;
      .vdr{
        border-width: 0.511797px;
        border-color: rgb(25, 178, 119);
        background-color: rgba(25, 178, 119, 0.12);
        border-radius: 4.09437px;
        // border-style: dashed;
        color: #c1c1c1;
        text-align: left;
        word-break: break-all;
        word-wrap: break-word;
        .draggable{
          text-align: center;
          vertical-align: middle;
          line-height: 50px;
        }
      }
    }
  }
}
</style>