<template>
  <div class="diff-container">
    <div class="item">
      <p class="title">一、单词比对</p>
      <el-form :inline="true" :model="formData1" class="demo-form-inline" label-position="top">
        <el-form-item class="form-item" label="输入一:">
          <el-input v-model="formData1.content1" placeholder="请输入"></el-input>
          <div v-if="diffResult1.length > 0" class="diff-result-item">
            <span>结果一：</span>
            <div class="diff-char">{{ diffResult1[0].value }}</div>
          </div>
        </el-form-item>
        <el-form-item class="form-item" label="输入二:">
          <el-input v-model="formData1.content2" placeholder="请输入"></el-input>
          <div v-if="diffResult1.length > 0" class="diff-result-item">
            <span>结果二：</span>
            <div class="diff-char">{{ diffResult1[1].value }}</div>
          </div>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="diffChars">比对单词</el-button>
    </div>
    <div class="item">
      <p class="title">二、文本比对</p>
      <el-form :inline="true" :model="formData2" class="demo-form-inline" label-position="top">
        <el-form-item class="form-item" label="输入一:">
          <el-input v-model="formData2.content1" placeholder="请输入"></el-input>
          <div v-if="diffResult2.length > 0" class="diff-result-item">
            <span>结果一：</span>
            <div class="diff-char">{{ diffResult2[0].value }}</div>
          </div>
        </el-form-item>
        <el-form-item class="form-item" label="输入二:">
          <el-input v-model="formData2.content2" placeholder="请输入"></el-input>
          <div v-if="diffResult2.length > 0" class="diff-result-item">
            <span>结果二：</span>
            <div class="diff-char">{{ diffResult2[1].value }}</div>
          </div>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="diffContent">比对文本</el-button>
    </div>
    <div class="item">
      <p class="title">三、json比对</p>
      <el-form :inline="true" :model="formData3" class="demo-form-inline" label-position="top">
        <el-form-item class="form-item" label="输入一:">
          <el-input v-model="formData3.content1" type="textarea" placeholder="请输入"></el-input>
          <div v-if="diffResult3.length > 0" class="diff-result-item">
            <span>结果一：</span>
            <div class="diff-char">{{ diffResult3[0].value }}</div>
          </div>
        </el-form-item>
        <el-form-item class="form-item" label="输入二:">
          <el-input v-model="formData3.content2" type="textarea" placeholder="请输入"></el-input>
          <div v-if="diffResult3.length > 0" class="diff-result-item">
            <span>结果二：</span>
            <div class="diff-char">{{ diffResult3[1].value }}</div>
          </div>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="diffJson">比对json</el-button>
    </div>
  </div>
</template>
<script>
const jsDiff = require('diff')
export default {
  data(){
    return {
      formData1:{
        content1:'',
        content2:''
      },
      diffResult1:[],
      formData2:{
        content1:'',
        content2:''
      },
      diffResult2:[],
      formData3:{
        content1:'',
        content2:''
      },
      diffResult3:[]
    }
  },
  methods:{
    // 比对单词的字符
    diffChars(){
      this.diffResult1 = jsDiff.diffChars(this.formData1.content1, this.formData1.content2)
      console.log('===diff1===', this.diffResult1)
    },
    // 比对文本内容
    diffContent(){
      this.diffResult2 = jsDiff.diffWords(this.formData2.content1, this.formData2.content2)
      console.log('===diff2===', this.diffResult2)
    },
    // 比对json
    diffJson(){
      this.diffResult3 = jsDiff.diffJson(this.formData3.content1, this.formData3.content2)
      console.log('===diff3===', this.diffResult3)
    }
  }
}
</script>
<style scoped lang="scss">
.diff-container{
  width: 100%;
  .item{
    width: 100%;
    border: solid 1px #f2f2f2;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
    .title{
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 20px;
    }
    .demo-form-inline{
      width: 100%;
      display: flex;
      .form-item{
        width: 48%;
        .diff-result-item{
          width: 210px;
          display: flex;
          align-items: center;
          .diff-char{
            color: brown;
          }
        }
      }
    }
  }
}
</style>