<template>
  <div class="wrap">
    <h3>一、vue虚拟滚动（vue-virtual-scroll-list）:选择十万条数据</h3>
    <p>用法</p>
    <p>1、父组件引入item子组件，然后将子组件配置到virtual-list虚拟列表组件中</p>
    <div class="list-content">
      <virtual-list
        style="height: 200px; overflow-y: auto;"
        :data-key="'id'"
        :data-sources="items"
        :data-component="itemComponent"
      />
    </div>
    <h3>二、vue手撸虚拟滚动组件:选择十万条数据</h3>
    <p>用法</p>
    <p>1、父组件引入自定义的虚拟滚动列表组件</p>
    <div class="custom-list-content">
      <virtual-scroll-list
        :list-data="listData"
        :item-height="50"
      />
    </div>
  </div>
</template>
<script>
import item from './components/item.vue'
import VirtualList from 'vue-virtual-scroll-list'
import virtualScrollList from './components/virtualScrollList.vue'

function createData(len) {
  const arr = []
  for (let index = 0; index < len; index++) {
    const obj = { id: index, text: Math.random() }
    arr.push(obj)
  }
  return arr
}

export default {
  components: {
    'virtual-list': VirtualList,
    'virtual-scroll-list': virtualScrollList
  },
  data() {
    return {
      itemComponent: item,
      items: createData(100000),
      listData: createData(100000)
    }
  },
  created() {
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.my-list {
  border: 1px solid #e8eaec;
  .my-list-item {
  height: 28px;
  padding-left: 15px;
  }
}
.tip{
  color: red;
}
.list-content{
  height: 200px;
}
.custom-list-content{
  height: 400px;
}
</style>
