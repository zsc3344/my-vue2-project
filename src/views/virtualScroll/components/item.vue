// item
<template>
  <div class="item">
    <img class="img" src="@/assets/logo.png" alt="" srcset="">
    <span>{{index+1}}、每一行的内容</span>
  </div>
</template>

<script>
  export default {
    name: 'item',
    props: {
      index: { // 每一行的索引
        type: Number
      },
      source: { // 每一行的内容
        type: Object,
        default () {
          return {}
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
.item{
  display: flex;
  flex-direction: row;
  align-items: center;
  // height: 60px;
  border: solid 1px #f2f2f2;
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 10px;
}
.img{
  width: 20px;
}
</style>
