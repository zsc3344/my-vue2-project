<template>
  <div class="upload-container">
    <el-form>
      <el-form-item>
        <el-upload
          ref="upload"
          class="upload-demo"
          :drag="true"
          action="fakeaction"
          multiple
          :show-file-list="false"
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
          <div class="upload-content">
            <i class="el-icon-upload" />
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>，单份文件大小不得超过 {{ size }}MB
            </div>
          </div>
        </el-upload>
      </el-form-item>
    </el-form>

    <!-- 文件列表自定义样式 -->
    <div v-if="fileList.length > 0" class="file-list">
      <div
        v-for="(file, index) in fileList"
        :key="index"
        class="file-item"
        :class="{ 'is-success': file.status === 'success' }"
      >
        <div class="file-type-icon">
          <i :class="getFileIcon(file)" />
        </div>
        <div class="file-info">
          <div class="file-name" :title="file.name">{{ file.name }}</div>
          <div class="file-size">{{ formatFileSize(file.size) }}</div>
        </div>
        <div class="file-actions">
          <el-tooltip content="预览" placement="top" :disabled="!canPreview(file)">
            <i
              class="el-icon-view action-icon preview-icon"
              :class="{ 'can-preview': canPreview(file) }"
              @click="handlePreview(file)"
            />
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <i
              class="el-icon-delete action-icon delete-icon"
              @click="handleRemove(file)"
            />
          </el-tooltip>
        </div>
      </div>
    </div>

    <!-- 添加预览弹窗 -->
    <el-dialog
      :visible.sync="previewVisible"
      :title="previewFile.name"
      width="65%"
      append-to-body
      destroy-on-close
    >
      <div class="preview-container">
        <img
          v-if="previewFile.type === 'image'"
          :src="previewFile.url"
          class="preview-image"
          alt="预览图片"
        >
        <iframe
          v-else-if="previewFile.type === 'pdf'"
          :src="previewFile.url"
          class="preview-pdf"
          width="100%"
          height="500px"
        />
        <div v-else class="preview-unsupported">
          该文件类型暂不支持预览
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios'
import { compressImage } from '@/utils/compress'

export default {
  props: {
    limit: {
      type: Number,
      default: 10
    },
    size: {
      type: Number,
      default: 5
    },
    fileType: {
      type: Array,
      default: () => ['pdf', 'doc', 'docx', 'xlsx', 'jpg', 'jpeg', 'png']
    },
    imgList: {
      type: Array,
      default: () => {
        return []
      }
    },
    url: {
      type: String,
      default: 'https://jsonplaceholder.typicode.com/posts/'
    }
  },
  data() {
    return {
      fileList: [],
      previewVisible: false,
      previewFile: {
        type: '',
        url: '',
        name: ''
      }
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
    handleRemove(file) {
      const index = this.fileList.findIndex(item => item.uid === file.uid)
      if (index !== -1) {
        this.fileList.splice(index, 1)
      }
      this.$emit('fileRemove', file)
    },
    handlePreview(file) {
      const fileType = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase()
      const isImage = ['jpg', 'jpeg', 'png'].includes(fileType)
      const isPdf = fileType === 'pdf'

      if (isImage || isPdf) {
        this.previewFile = {
          type: isImage ? 'image' : 'pdf',
          url: file.url || URL.createObjectURL(file.raw),
          name: file.name
        }
        this.previewVisible = true
      } else {
        this.$message.info('该文件类型暂不支持预览')
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 ${this.limit} 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    },
    async beforeUpload(file) {
      const fileType = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase()
      const isAvailableType = this.fileType.indexOf(fileType) > -1
      const isImage = ['jpg', 'jpeg', 'png'].includes(fileType)
      const fileSize = file.size / 1024 / 1024

      if (!isAvailableType) {
        this.$message.error('上传文件类型不为允许上传的文件类型!')
        return false
      }

      if (isImage && fileSize > this.size) {
        try {
          const compressedFile = await compressImage(file, this.size)
          Object.defineProperty(file, 'raw', {
            value: compressedFile
          })
          return true
        } catch (error) {
          this.$message.error('图片压缩失败，请重试!')
          return false
        }
      }

      if (!isImage && fileSize > this.size) {
        this.$message.error(`上传文件大小不能超过 ${this.size}MB!`)
        return false
      }

      return true
    },
    beforeRemove(file) {
      return this.$confirm(`确定要删除 ${file.name}？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        return false
      })
    },
    uploadHttpRequest(params) {
      const formData = new FormData()
      formData.append('file', params.file)
      axios
        .post(this.url, formData)
        .then((res) => {
          if (res.code === 0) {
            params.onSuccess()
          }
        })
        .catch((err) => {
          console.log('失败', err)
          params.onError()
        })
    },
    upLoadSuccess(response) {
      this.$emit('uploadimg', response.message)
      this.$message('上传成功')
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    async handleChange(file, fileList) {
      this.fileList = fileList
      this.$emit('fileChange', file)
    },
    clearFiles() {
      this.$refs.upload.clearFiles()
      this.fileList = []
    },
    // 获取文件图标
    getFileIcon(file) {
      const fileType = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase()
      const iconMap = {
        pdf: 'el-icon-document',
        doc: 'el-icon-document-remove',
        docx: 'el-icon-document-remove',
        xlsx: 'el-icon-document-copy',
        jpg: 'el-icon-picture-outline',
        jpeg: 'el-icon-picture-outline',
        png: 'el-icon-picture-outline'
      }
      return iconMap[fileType] || 'el-icon-document'
    },
    // 格式化文件大小
    formatFileSize(size) {
      if (!size) return '0 B'
      const units = ['B', 'KB', 'MB', 'GB']
      let index = 0
      while (size >= 1024 && index < units.length - 1) {
        size /= 1024
        index++
      }
      return `${size.toFixed(1)} ${units[index]}`
    },
    // 判断文件是否可预览
    canPreview(file) {
      const fileType = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase()
      return ['jpg', 'jpeg', 'png', 'pdf'].includes(fileType)
    }
  }
}
</script>
<style lang="scss" scoped>
.upload-container {
  width: 100%;
}

:deep(.el-upload) {
  width: 100%;
}

:deep(.el-upload-dragger) {
  width: 100% !important;
  height: 150px !important;
  transition: all 0.3s;

  &:hover {
    border-color: #409EFF;

    .el-icon-upload {
      color: #409EFF;
    }
  }

  .el-icon-upload {
    font-size: 40px;
    color: #909399;
    margin-bottom: 8px;
    transition: color 0.3s;
  }
}

:deep(.el-upload-list) {
  display: none;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.el-upload__text {
  font-size: 14px;
  color: #606266;
  text-align: center;

  em {
    color: #409EFF;
    font-style: normal;
    font-weight: 500;
  }
}

.upload-limit {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
  background-color: #f5f7fa;
  padding: 4px 12px;
  border-radius: 12px;
  display: inline-block;
}

.preview-image {
  max-width: 100%;
  max-height: 500px;
}

.preview-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  background-color: #f5f7fa;
  border-radius: 4px;
  padding: 20px;
}

.preview-image {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
}

.preview-pdf {
  width: 100%;
  height: 70vh;
  border: none;
}

.preview-unsupported {
  color: #909399;
  font-size: 14px;
  text-align: center;
  padding: 40px;
}

:deep(.el-dialog__body) {
  padding: 10px 20px;
}

:deep(.el-dialog__header) {
  padding: 15px 20px;
  border-bottom: 1px solid #e4e7ed;
}

.file-list {
  width: 100%;
  margin-top: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  transition: all 0.3s;
  border-bottom: 1px solid #e4e7ed;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f5f7fa;

    .file-actions {
      opacity: 1;
    }
  }

  &.is-success {
    .file-type-icon {
      color: #67c23a;
    }
  }
}

.file-type-icon {
  font-size: 24px;
  color: #909399;
  margin-right: 12px;
  width: 24px;
  text-align: center;
}

.file-info {
  flex: 1;
  min-width: 0;
  margin-right: 12px;
}

.file-name {
  font-size: 14px;
  color: #606266;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-size {
  font-size: 12px;
  color: #909399;
}

.file-actions {
  display: flex;
  gap: 12px;
  opacity: 0;
  transition: opacity 0.3s;
}

.action-icon {
  font-size: 16px;
  cursor: pointer;
  color: #909399;
  transition: all 0.3s;

  &:hover {
    transform: scale(1.1);
  }

  &.preview-icon {
    &:not(.can-preview) {
      cursor: not-allowed;
      opacity: 0.5;

      &:hover {
        transform: none;
      }
    }

    &.can-preview:hover {
      color: #409EFF;
    }
  }

  &.delete-icon:hover {
    color: #f56c6c;
  }
}
</style>
