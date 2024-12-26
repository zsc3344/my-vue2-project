<template>
  <div ref="container" class="custom-virtual-list" @scroll="handleScroll($event)">
    <div class="placeholder-container" :style="{'height': listHeight + 'px'}" />
    <!-- 设置transform:translateY(offset)，针对整个列表垂直平移 -->
    <div class="list-container" :style="{'transform': getTransform}">
      <!-- 列表渲染位置 -->
      <!-- 循环渲染的item必须设置height和line-height,不然随着滚动，line-height为越来越小 -->
      <div v-for="item in renderList" :key="item.id" class="item" :style="{ 'height': itemHeight + 'px', 'lineHeight': itemHeight + 'px' }">
        <div class="item-content">{{ item.id + 1 }}:列表item文字内容</div>
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
      default: 100
    }
  },
  data() {
    return {
      startIndex: 0,
      containerHeight: 0,
      offset: 0
    }
  },
  computed: {
    listHeight() {
      return this.listData.length * this.itemHeight
    },
    renderCount() {
      // 获取定高虚拟列表中的渲染数量，通过Math.ceil()向上取整,这应该是一个固定值，所以可以放到computed中
      return Math.ceil(this.containerHeight / this.itemHeight)
    },
    endIndex() {
      return this.startIndex + this.renderCount
    },
    renderList() {
      // 获取定高虚拟列表中的渲染列表，根据开始索引startIndex和结束索引endIndex，获取渲染列表，slice方法包含start,不包含end,所以需要+1
      return this.listData.slice(this.startIndex, this.endIndex + 1)
    },
    getTransform() {
      // 设置transform:translateY(offset)，针对整个列表垂直平移
      return `translateY(${this.offset}px)`
    }
  },
  mounted() {
    this.containerHeight = this.$refs.container.clientHeight
  },
  methods: {
    handleScroll(e) {
      // 每次滚动监听，获取滚动距离
      const scrollTop = e.target.scrollTop
      // 通过Math.floor()向下取整，获取当前渲染的列表的startIndex
      this.startIndex = Math.floor(scrollTop / this.itemHeight)
      // 通过滚动距离%item高度，取余数，得到没有超过一个item高度的滚动距离，只有一整个item高度的滚动距离，才会将那个item隐藏，半个item滚动距离的时候item不会消失，不需要手动去偏移这个距离
      // 滚动距离在0-itemHeight之间时，渲染的DOM没有变化，我们完全是复用浏览器的滚动，并没有进行任何处理。
      this.offset = scrollTop - (scrollTop % this.itemHeight)
    }
  }
}
</script>
<style lang="scss" scoped>
.custom-virtual-list{
  position: relative;
  height: 500px;
  overflow: auto;
  border: 1px solid #ccc;
  .placeholder-container{
    width: 100%;
    position: absolute;
    z-index: -1;
  }
  .list-container{
    height: 100%;
    display: flex;
    flex-direction: column;
    .item{
      display: flex;
      justify-content: center;
      align-items: center;
      .item-content{
        width: calc(100% - 10px);
        height: calc(100% - 10px);
        border: solid 1px #f2f2f2;
        border-radius: 5px;
        display: flex;
        align-items: center;
        padding: 2px 10px;
      }
    }
  }
}
</style>
