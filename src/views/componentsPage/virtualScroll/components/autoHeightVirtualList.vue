<template>
  <div class="container">
    <div class="list-container">
      <!-- 虚拟列表区域 -->
      <div v-for="item in renderList" :key="item.id" class="item">
        {{ item.id }}、{{ item.text }}
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
      endIndex: 0
    }
  },
  computed: {
    renderList() {
      return this.listData.slice(this.startIndex, this.startIndex + this.endIndex + 1)
    }
    // endIndex(){
    //   return Math.ceil()
    // }
  },
  mounted() {

  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>
.container{
  width: 100%;
}
</style>
