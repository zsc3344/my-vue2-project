<template>
    <div class="qr-code" :style="{width:size+'px'}">
        <vue-qr :logoSrc="logoSrc" :bgSrc="bgSrc" :text="text" :size="size" :colorDark="colorDark" :callback="getDataURI"></vue-qr>
        <el-button type="primary" @click="qrDownLoad">下载二维码</el-button>
    </div>
</template>
<script>
import vueQr from 'vue-qr'
export default {
    name:"QRCode",
    components:{
        vueQr
    },
    props:{
        text:{
            type:String,
            default:'https://esign.junrunrenli.com/fdd/#/login'
        },
        logoSrc:{
            type:String,
            default:''
        },
        bgSrc:{
            type:String,
            default:''
        },
        size:{
          type: Number,
          default:200
        },
        colorDark:{
          type:String,
          default:''
        }
    },
    data(){
      return {
        dataURI:''
      }
    },
    methods:{
      getDataURI(dataURI,qid){
        if(dataURI){
          // 获取回调函数返回的图片base64
          this.dataURI = dataURI
        }
      },
      qrDownLoad() {
        if (window.navigator.msSaveOrOpenBlob) {
          const qrStr= atob(data.split(',')[1]);
          let n = qrStr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          const blob = new Blob([u8arr]);
          window.navigator.msSaveOrOpenBlob(blob, '二维码'+ '.' + 'png');
        } else {
          // 这里就按照chrome等新版浏览器来处理
          const a = document.createElement('a');
          a.href = this.dataURI;
          a.setAttribute('download', '二维码');
          a.click();
        }
      }
    }
}
</script>
<style lang="scss" scoped>
.qr-code{
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
