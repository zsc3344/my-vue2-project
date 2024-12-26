<template>
  <div class="wrap">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="vue-virtual-scroll-list-三方库" name="first">
        <virtual-list
          style="height: 200px; overflow-y: auto;"
          :data-key="'id'"
          :data-sources="listData"
          :data-component="itemComponent"
        />
      </el-tab-pane>
      <el-tab-pane label="定高虚拟列表-手撸" name="second">
        <fixed-height-virtual-list
          :list-data="listData"
          :item-height="50"
        />
      </el-tab-pane>
      <el-tab-pane label="不定高虚拟列表-手撸" name="third">
        <div class="wrap-item">
          <div>
            <auto-height-virtual-list
              :list-data="listData"
              :item-height="50"
            />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import item from './components/item.vue'
import VirtualList from 'vue-virtual-scroll-list'
import fixedHeightVirtualList from './components/fixedHeightVirtualList.vue'
import autoHeightVirtualList from './components/autoHeightVirtualList.vue'

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
    'fixed-height-virtual-list': fixedHeightVirtualList,
    'auto-height-virtual-list': autoHeightVirtualList
  },
  data() {
    return {
      activeName: 'second',
      itemComponent: item,
      listData: createData(100000)
    }
  },
  created() {
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>
<style lang="scss" scoped>
.wrap-item{
  margin: 20px 0;
}
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
