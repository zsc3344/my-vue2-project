<template>
  <div>
    <div>
      <span class="title">1.vue-qr二维码:可以改变二维码颜色，可以设置中间logo,可以设置背景图片</span>
      <div class="item-content">
        <vueqr :text="qrcodeData.text" :logoSrc="qrcodeData.logoSrc" :bgSrc="qrcodeData.bgSrc" :size="qrcodeData.size" :coloeDark="qrcodeData.coloeDark"/>
      </div>
      <span class="title">2.canvas meqrcode二维码:设置二维码颜色，中间填充文字</span>
      <div class="item-content">
        <meqrcode :qr-url='qrcodeData.text' :qr-size='qrcodeData.size' :qr-text-size="20"  qr-text="电子签约平台"></meqrcode>
      </div>
    </div>

  </div>
</template>
<script>
import vueqr from '@/components/vueqr.vue'
import meqrcode from "@/components/meqrcode.vue";
export default {
  name:'qrcode',
  components: {
    vueqr,
    meqrcode
  },
  data(){
    return {
      qrcodeData: {
        logoSrc:require('@/assets/jr_logo.png'),
        bgSrc:require('@/assets/logo.png'),
        text: 'https://esign.junrunrenli.com/fdd/',
        size:200,
        coloeDark:'#F29700'
      }
    }
  },
  created(){
  },
  methods:{
  }
}
</script>
<style lang="scss" scoped>
.item-content{
  margin-bottom: 20px;
}
</style>
