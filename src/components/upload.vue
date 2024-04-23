<template>
  <div class="upload">
    <el-form>
      <el-form-item>
        <el-upload
          ref="upload"
          class="upload-demo"
          :drag="true"
          action="fakeaction"
          multiple
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-upload="beforeUpload"
          :http-request="uploadHttpRequest"
          :before-remove="beforeRemove"
          :on-success="upLoadSuccess"
          :limit="limit"
          :auto-upload="false"
          :on-change="handleChange"
          :on-exceed="handleExceed"
          :file-list="fileList"
        >
          <div>
            <i class="el-icon-upload" />
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em><br><span>单份文件大小不得超过1MB。</span>
            </div>
          </div>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  props: {
    limit: {
      type: Number
    },
    size: {
      type: Number,
      default: 2
    },
    fileType: {
      type: Array,
      default: () => {
        return ['pdf', 'doc', 'docx', 'xlsx', 'jpg', 'jpeg', 'png']
      }
    },
    imgList: {
      type: Array,
      default: () => {
        return []
      }
    },
    url: {
      type: String,
      default: 'https://jsonplaceholder.typicode.com/posts/',
    }
  },
  data() {
    return {
      fileList: []
    }
  },
  mounted() {
    if (this.imgList.length !== 0) {
      this.imgList.forEach((el) => {
        this.fileList.push(el)
      })
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 ${this.limit} 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    },
    beforeUpload(file) {
      const fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
      const isAvailableType = this.fileType.indexOf(fileType) > -1
      const isLt2M = file.size / 1024 / 1024 < this.size

      if (!isAvailableType) {
        this.$message.error('上传文件类型不为允许上传的文件类型!')
      }

      if (!isLt2M) {
        this.$message.error(`上传文件大小不能超过 ${this.size}MB!`)
      }
      return isAvailableType && isLt2M
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 自定义上传方法，params是默认参数，可以取得file文件信息，具体信息如下图
    uploadHttpRequest(params) {
      const formData = new FormData() // FormData对象，添加参数只能通过append('key', value)的形式添加
      formData.append('file', params.file) // 添加文件对象
      axios
        .post(this.url, formData)
        .then((res) => {
          if (res.code === 0) {
            params.onSuccess() // 上传成功的文件显示绿色的对勾
          }
        })
        .catch((err) => {
          console.log('失败', err)
          params.onError() // 上传失败的文件会从文件列表中删除
        })
    },
    // 上传文件成功事件
    upLoadSuccess(response) {
      this.$emit('uploadimg', response.message)
      this.$message('上传成功')
    },

    // 点击上传：手动上传到服务器，此时会触发组件的http-request
    submitUpload() {
      this.$refs.upload.submit()
    },
    async handleChange(file, fileList){
      this.$emit('fileChange', file)
    }
  }
}
</script>
<style lang="scss" scoped>
:deep(.el-upload-dragger){
  height: 150px !important;
}
:deep(.el-upload-list__item):hover{
  background-color: #F9F9F9;
  .el-icon-close::before{
    border-radius: 9px;
    color:#FFFFFF;
    background-color: #C4C4C4;
  }
}
.el-upload__text{
  font-size: 14px;
  span{
    font-size: 12px;
  }
}
</style>
