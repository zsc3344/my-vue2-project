<template>
  <div class="container">
    <h3>一、html元素设置成画中画：window.documentPictureInPicture</h3>
      <!-- html元素 -->
    <div id="pipContent" style="width: 600px;height: 300px;background: pink;font-size: 20px;">这是一个将要放入画中画的 div 元素！</div>
    <button id="clickBtn" @click="openPicture">打开html元素画中画</button>
    <button id="clickBtn" @click="closePicture">关闭画中画</button>
    <!-- 视频元素 -->
    <h3>二、视频元素设置成画中画：HTMLVideoElement.disablePictureInPicture</h3>
     <br>
     <video id="videoContent" width="320" controls="controls" autoplay="autoplay" muted loop="loop">
      <source src="http://vjs.zencdn.net/v/oceans.mp4" type="video/mp4">
      您的浏览器不支持 HTML5 video 标签。
    </video>
    <br>
    <button id="clickBtn" @click="toggleVideo">切换视频画中画</button>
    <!-- <button id="clickBtn" @click="openVideoPicture">打开视频画中画</button>
    <button id="clickBtn" @click="closeVideoPicture">关闭视频画中画</button> -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      
    }
  },
  created(){
    if ('documentPictureInPicture' in window) {
        console.log("🚀 浏览器支持 PiP 功能！");
    } else {
        console.warn("⚠️ 当前浏览器不支持 PiP 功能，更新浏览器或者换台电脑吧！");
    }
  },
  methods:{
    async openPicture(){
      const pipContent = document.getElementById("pipContent")

      // 请求创建一个 PiP 窗口
      const pipWindow = await window.documentPictureInPicture.requestWindow({
          width: 200,  // 设置窗口的宽度
          height: 300  // 设置窗口的高度
      });

      // 监听进入和退出 PiP 模式的事件
      pipWindow.addEventListener("pagehide", (event) => {
          console.log("已退出 PIP 窗口");
      });

      pipWindow.addEventListener('focus', () => {
          console.log("PiP 窗口进入了焦点状态");
      });

      pipWindow.addEventListener('blur', () => {
          console.log("PiP 窗口失去了焦点");
      });

      // 将原始元素添加到 PiP 窗口中
      // pipWindow.document.body.appendChild(pipContent)
      // 将原始代码克隆一份，并添加到 PiP 窗口中
      pipWindow.document.body.appendChild(pipContent.cloneNode(true));
    },
    closePicture(){
      // 关闭 PiP 窗口
      window.documentPictureInPicture.window.close();
    },
    async openVideoPicture(){
      const pipContent = document.getElementById("videoContent")

      // 请求创建一个 PiP 窗口
      const pipWindow = await window.documentPictureInPicture.requestWindow({
          width: pipContent.clientWidth,  // 设置窗口的宽度
          height: pipContent.clientHeight  // 设置窗口的高度
      });

      // 监听进入和退出 PiP 模式的事件
      pipWindow.addEventListener("pagehide", (event) => {
          console.log("已退出 PIP 窗口");
      });

      pipWindow.addEventListener('focus', () => {
          console.log("PiP 窗口进入了焦点状态");
      });

      pipWindow.addEventListener('blur', () => {
          console.log("PiP 窗口失去了焦点");
      });

      // 将原始元素添加到 PiP 窗口中
      // pipWindow.document.body.appendChild(pipContent)
      // 将原始代码克隆一份，并添加到 PiP 窗口中
      pipWindow.document.body.appendChild(pipContent.cloneNode(true));
    },
    // 切换视频画中画
    toggleVideo(){
      const pipContent = document.getElementById("videoContent")
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
      } else {
        if (document.pictureInPictureEnabled) {
          pipContent.requestPictureInPicture();
        }
      }
    },
    closeVideoPicture(){
      // 关闭 PiP 窗口
      window.documentPictureInPicture.window.close();
    }
  }
}
</script>
<style scoped lang="scss">
.container{
  height: calc(100vh - 90px);
  background-color: aquamarine;
  #pipContent {
    width: 600px;
    height: 300px;
    background: pink;
    font-size: 20px;
  }
}
</style>