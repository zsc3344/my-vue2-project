<template>
  <div>
    <el-button v-if="!listenStatus" @click="startListening()">开始录音</el-button>
    <el-button v-else @click="stopListening()">结束录音</el-button>
    <div class="item">
      <span v-if="listenStatus" class="listen-status">录音中...</span>
    </div>
    <div class="item">
      <span class="title">提示信息：{{ tips }}</span>
    </div>
    <div class="item">
      <span class="title">监听语音转换文字：</span><span>{{translateDesc}}</span>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      recognition: null,
      translateDesc: '',
      listenStatus: false,
      tips:''
    }
  },
  created(){
    console.log('===window===', window)
  },
  methods:{
    startListening() {
      // 检查浏览器是否支持 Speech Recognition API
      if ('webkitSpeechRecognition' in window) {
        this.recognition = new window.webkitSpeechRecognition()
        this.recognition.continuous = true; // 允许识别多段语音
        this.recognition.lang = 'zh-CN'; // 设置识别语言为中文

        this.recognition.start(); // 开始监听语音
        console.log('===开始监听语音===')
        this.listenStatus = true
        let that = this
        this.recognition.onresult = function(event) {
          var current = event.resultIndex;
          if(event.results[current][0].transcript){
            if(that.translateDesc){
              that.translateDesc = that.translateDesc + ',' + event.results[current][0].transcript;
            }else{
              that.translateDesc = event.results[current][0].transcript;
            }
          }else{
            that.translateDesc = that.translateDesc
          }
          console.log('转换后的文字: ', that.translateDesc);
          that.tips = "语音识别成功"
        };
        this.recognition.onspeechend = function() {
          that.recognition.stop();
        }

        this.recognition.onnomatch = function(event) {
          that.tips = "I didn't recognise that color.";
        }

        this.recognition.onerror = function(event) {
          that.tips = 'Error occurred in recognition: ' + event.error;
        }
      } else {
        console.log('浏览器不支持 Speech Recognition API');
      }
    },
    stopListening(){
      this.listenStatus = false
      this.recognition.stop(); // 结束录音
    }
  }
}
</script>
<style scoped lang="scss">
.item{
  margin-top: 20px;
  .title{
    color: red;
  }
  .listen-status{
    color: red;
  }
}
</style>