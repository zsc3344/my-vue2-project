<template>
  <div ref="container" class="container" @scroll="handleScroll($event)">
    <div class="placeholder" :style="{'height': listHeight + 'px'}" />
    <div class="list-wrapper" :style="{'transform': getTransform}">
      <!-- 只渲染可视区域的列表 -->
      <div v-for="item in renderList" :key="item.id" class="item" :style="{'height': itemHeight + 'px','lineHeight': itemHeight + 'px','backgroundColor': `rgba(0,0,0,${item / 100})`}">
        <img class="img" src="@/assets/logo.png" alt="" srcset="">
        <span>{{ item.id+1 }}、每一行的内容</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    listData: {
      type: Array,
      default() {
        return []
      }
    },
    itemHeight: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      startIndex: 0,
      offset: 0,
      containerHeight: 0
    }
  },
  computed: {
    endIndex() {
      return this.startIndex + this.renderCount
    },
    listHeight() {
      return this.listData.length * this.itemHeight
    },
    renderCount() {
      return Math.ceil(this.containerHeight / this.itemHeight)
    },
    renderList() {
      return this.listData.slice(this.startIndex, this.endIndex + 1)
    },
    getTransform() {
      return `translateY(${this.offset}px)`
    }
  },
  mounted() {
    this.containerHeight = this.$refs.container.clientHeight
  },
  methods: {
    handleScroll(e) {
      const scrollTop = e.target.scrollTop
      this.startIndex = Math.floor(scrollTop / this.itemHeight)
      this.offset = scrollTop - (scrollTop % this.itemHeight)
    }

  }
}
</script>
<style scoped lang="scss">
.container{
  border: solid 1px #ccc;
  height: 100%;
  overflow: auto;
  position: relative;
  .placeholder{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    z-index: -1;
  }
  .list-wrapper{
    width: 100%;
    display: flex;
    flex-direction: column;
    .item{
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      // height: 60px;
      border: solid 1px #f2f2f2;
      border-radius: 8px;
      margin: 0 10px 10px 10px;
      padding: 10px;
      .img{
        width: 20px;
      }
    }
  }
}
</style>
