<template>
  <div class="pdf-container" :style="{ 'height': (clientHeight - 100)+'px' }">
    <div class="pdf-operate">
      <input type="file" id="fileInput" multiple @change="fileChange" />
        <div class="file-list">
          <div v-for="(item, index) in fileList" class="file-item">
            <el-button type="text">{{index+1}}、{{ item.name }}</el-button>
          </div>
        </div>
        <el-button type="primary" @click="previewMergePDF()">预览合并的PDF</el-button>
        <el-button type="primary" @click="downloadMergePDF()">下载合并的PDF</el-button>
    </div>
    <div class="pdf-preview">
      <p>合并pdf预览</p>
      <iframe class="iframe" :src="mergedUrl" frameborder="0"></iframe>
    </div>
  </div>
</template>
<script>
import { PDFDocument  } from "pdf-lib"
export default {
  data(){
    return {
      fileList: [],
      clientHeight: 0,
      mergedUrl:''
    }
  },
  create(){
    const fileInput = document.getElementById("fileInput")
    this.fileList = fileInput.files
  },
  mounted(){
    this.clientHeight = document.body.clientHeight
    window.addEventListener('resize', () => {
      this.clientHeight = document.body.clientHeight
    })
  },
  watch:{

  },
  methods:{
    fileChange(){
      const fileInput = document.getElementById("fileInput")
      this.fileList = fileInput.files
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    handleChange(file, fileList){
      this.fileList = fileList
      console.log('===fileList===', fileList)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    async previewMergePDF() {
      const fileInput = document.getElementById("fileInput")
      const files = fileInput.files
      console.log('===files===', files)
      this.fileList = fileInput.files
      if (files.length < 2) {
        alert("请至少选择两个PDF文件进行合并！")
        return
      }
      // 创建一个新的PDF文档
      const mergedPdf = await PDFDocument.create()
      // 遍历选择的每个文件
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const reader = new FileReader()
        // 读取文件内容
        const fileContents = await new Promise((resolve, reject) => {
          reader.onload = function (event) {
            resolve(event.target.result)
          };
          reader.onerror = function (event) {
            reject(new Error("文件读取错误。"))
          };
          reader.readAsArrayBuffer(file)
        });
        // 将PDF文件添加到合并的PDF文档中
        const pdf = await PDFDocument.load(fileContents)
        const copiedPages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices()
        );
        copiedPages.forEach((page) => {
          mergedPdf.addPage(page)
        });
      }
      // 使用浏览器自带预览功能，预览合并后的PDF
      const mergedPdfBytes = await mergedPdf.save();
      const mergedPdfBlob = new Blob([mergedPdfBytes], {
        type: "application/pdf",
      });
      const fileURL = URL.createObjectURL(mergedPdfBlob)
      this.mergedUrl = fileURL
      // window.open(fileURL);
    },
    async downloadMergePDF() {
      const fileInput = document.getElementById("fileInput")
      const files = fileInput.files;
      if (files.length < 2) {
        alert("请至少选择两个PDF文件进行合并！")
        return
      }
      const mergedPdf = await PDFDocument.create()
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const reader = new FileReader()
        const fileContents = await new Promise((resolve, reject) => {
          reader.onload = function (event) {
            resolve(event.target.result)
          };
          reader.onerror = function (event) {
            reject(new Error("文件读取错误。"))
          }
          reader.readAsArrayBuffer(file)
        });
        const pdf = await PDFDocument.load(fileContents);
        const copiedPages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices()
        )
        copiedPages.forEach((page) => {
          mergedPdf.addPage(page)
        })
      }
      const mergedPdfFile = await mergedPdf.saveAsBase64()
      const downloadLink = document.createElement("a")
      downloadLink.href = "data:application/pdf;base64," + mergedPdfFile
      downloadLink.download = "合并文件.pdf"
      downloadLink.click()
    }
  }
}
</script>
<style lang="scss" scoped>
.pdf-container{
  display: flex;
  .pdf-operate{
    width: 30%;
    .file-list{
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin: 20px 0;
      .file-item{
        padding: 0 10px;
        margin-bottom: 10px;
        border: solid 1px #f2f2f2;
      }
    }
  }
  .pdf-preview{
    width: 60%;
    height: 100%;
    border: solid 1px #f2f2f2;
    .iframe{
      width: 100%;
      height: 100%;
    }
  }
}
</style>