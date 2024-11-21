<template>
  <div style="border: 1px solid #ccc;" class="wangEditor">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editor"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      style="overflow-y: hidden;"
      :style='{height: height + "px"}'
      v-model="html"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="onCreated"
      @customPaste ="customPaste"
    />
  </div>
</template>


<script>
/**
 *文档地址 https://www.wangeditor.com/v5/editor-config.html
 *   目前只配置了目前需要的配置
 *
 * */

// import Vue from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
// import { uploadFile } from '@/api/common'
import { Message } from 'element-ui'
export default {
  components: { Editor, Toolbar },
  props: {
    height: {
      default: 188
    },
    placeholder: {
      default: null
    },
    readOnly: {
      default: false
    },
    maxLength: {
      default: 2000
    },
    maxNumberOfFiles: {
      default: 10
    },
    maxFileSize: {
      default: 2 * 1024 * 1024
    },
    value: {}
  },
  data() {
    return {
      filesCount: 0,

      editor: null, // 实例对象 和ref作用一致
      html: this.value || '', // value
      toolbarConfig: { },
      editorConfig: {
        placeholder: this.placeholder,
        readOnly: this.readOnly,
        maxLength: this.maxLength,
        // minlength: 0,
        MENU_CONF: {
          uploadImage: {
            // fieldName: 'file',
            // server: process.env.VUE_APP_BASE_URL_File + '/jrit-zlzp-file-api/file/upload',

            // 单个文件的最大体积限制，默认为 2M
            maxFileSize: this.maxFileSize, // 1M
            // 最多可上传几个文件，默认为 100
            maxNumberOfFiles: this.maxNumberOfFiles,
            // uploadImgMaxLength: 1,
            // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
            allowedFileTypes: [],
            // allowedFileTypes: ['image/*'],

            // headers: {
            //   login_type: 'file',
            //   Authorization: JSON.parse(localStorage.getItem('userInfo')).token
            // },

            // customUpload: null,
            customUpload: (file, insertFn) => {
              // console.log(this,'maxFileSize')
              if (file.size > this.maxFileSize) {
                this.$message.error(`图片大小不能超过${this.maxFileSize / 1024 / 1024}M`);
                return;
              }
              // console.log(this.filesCount,'this.filesCount')
              if (this.filesCount + 1 > this.maxNumberOfFiles) {
                this.$message.error(`最多上传${this.maxNumberOfFiles}张图片`);
                return;
              }
              this.filesCount ++
              console.log(file,'file, insertFn',insertFn);
              const formData = new FormData();
              formData.append('file', file);
              formData.append('fileName', file.name);
              insertFn(formData, insertFn)
              // console.log(formData,'formData');
              // ================TODO 需要调用文件上传接口，上传图片，获取url文件，展示出来===================
              // uploadFile(formData).then(res => {
              //   insertFn(res.data.url);
              // });
            },

            // customInsert(res, insertFn) { // JS 语法
            //   // res 即服务端的返回结果
            //
            //   // 从 res 中找到 url alt href ，然后插入图片
            //   insertFn(res.data.url);
            // },
            // onBeforeUpload(file) { // JS 语法
            // // file 选中的文件，格式如 { key: file }
            //
            //   // 由于现在文件上传数量未生效，所以在上传之前限制
            //   const regex = new RegExp('<img', 'g');
            //   console.log(this.html, 'html');
            //   const result = this.html.match(regex);
            //   const count = !result ? 0 : result.length;
            //
            //   if (count > this.maxNumberOfFiles) {
            //     this.$message.error(`最多上传${this.maxNumberOfFiles}张图片`);
            //     return;
            //   }
            //   console.log(file, 'file');
            //   return file;
            //
            //   // 可以 return
            //   // 1. return file 或者 new 一个 file ，接下来将上传
            //   // 2. return false ，不上传这个 file
            // },
          }
        }
      },
      mode: 'default' // or 'simple'
    }
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
    },
    // 自定义粘贴事件
    customPaste(editor, event, callback){
      const html = event.clipboardData.getData('text/html')
      const text = event.clipboardData.getData('text/plain')
      if(text.length > this.maxLength){
        this.$message.warning(`复制文本超过${this.maxLength}字数`)
      }else{
        editor.setHtml(html)
      }

      // 阻止默认的粘贴行为
      event.preventDefault()
      // vue写法：customPaste方法还存在第三个参数callback,使用callback(false)阻止浏览器默认粘贴事件
      // 其他写法，可能是react：return false实现阻止浏览器默认粘贴事件
      callback(false)
    }
    // init() {
    //   this.editorConfig.MENU_CONF.uploadImage = {
    //     ...this.editorConfig.MENU_CONF.uploadImage,
    //     customUpload: this.customUpload
    //   }
    // },
    // customUpload(file, insertFn) {
    //   // console.log(this,'maxFileSize')
    //   if (file.size > this.maxFileSize) {
    //     this.$message.error(`图片大小不能超过${this.maxFileSize / 1024 / 1024}M`);
    //     return;
    //   }
    //   // console.log(this.filesCount,'this.filesCount')
    //   if (this.filesCount + 1 > this.maxNumberOfFiles) {
    //     this.$message.error(`最多上传${this.maxNumberOfFiles}张图片`);
    //     return;
    //   }
    //   this.filesCount ++
    //   console.log(file,'file, insertFn',insertFn);
    //   const formData = new FormData();
    //   formData.append('file', file);
    //   formData.append('fileName', file.name);
    //   console.log(formData,'formData');
    //   uploadFile(formData).then(res => {
    //     insertFn(res.data.url);
    //   });
    // },
  },
  watch: {
    'html': {
      handler(value) {
        this.$emit('input', value);

        const regex = new RegExp('<img', 'g');
        // console.log(this.html, 'html');
        const result = this.html.match(regex);
        this.filesCount = !result ? 0 : result.length;
      }
    },
    value: {
      handler() {
        this.html = this.value;
      }
    }
  },
  mounted() {
    // this.init();
  },
  beforeDestroy() {
    const editor = this.editor;
    if (editor == null) return;
    editor.destroy(); // 组件销毁时，及时销毁编辑器
  }
}
</script>
<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang='scss' scoped>
.wangEditor{
  width: 100%;
  height: 100%;
}
.w-e-toolbar{
  background-color: #f1f1f1;
  height: 50px;
  align-items: center;
}
.w-e-bar-item{
  .title{
    margin: 0!important;
    margin-left: 5px!important;
  }
}
.text-editor {
  border: 1px solid #f1f1f1;
  height: 190px;
  /*min-height: 500px;*/
}
.editor-subject-name {
  background-color: #fff;
  font-size: 18px;
  padding: 10px 4px;
}
</style>
