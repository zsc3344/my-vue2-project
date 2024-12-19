<template>
  <div class="hamburger-container">
    <div class="title">Hamburger动态图标</div>
    <div class="icons">
      <div class="item">
        <span>翻转90度</span>
        <el-button id="hamburger1" class="hamburger" @click="change('vertical')">
          <span class="icon"></span>
        </el-button>
      </div>
      <div class="item">
        <span>取消图标</span>
        <el-button id="hamburger2" class="hamburger" @click="change('cancel')">
          <span class="icon"></span>
        </el-button>
      </div>
      <div class="item">
        <span>关闭/打开图标</span>
        <el-button id="hamburger3" class="hamburger hamburger-toggle-right" @click="change('toggle')">
          <div class="icon-div">
            <span class="icon"></span>
          </div>
        </el-button>
      </div>
      <div class="item">
        <span>增加/减少图标</span>
        <el-button id="hamburger4" class="hamburger hamburger-add" @click="change('reduce')">
          <div class="icon-div">
            <span class="icon1"></span>
            <span class="icon2"></span>
          </div>
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name:'Hamburger',
  data() {
    return {
    }
  },
  created(){

  },
  mounted(){
    let el = document.getElementsByClassName('hamburger')
    for(let i = 0; i<el.length;i++){
      el[i].addEventListener('click', function(){
        this.classList.toggle('active')
      },false)
    }
  },
  methods:{
    vertical(){
      document.getElementById('hamburger1').classList.toggle('hamburger-vertical')
    },
    change(value){
      switch(value){
        case 'vertical':
          document.getElementById('hamburger1').classList.toggle('hamburger-vertical')
          break
        case 'cancel':
          document.getElementById('hamburger2').classList.toggle('hamburger-cancel')
          break
        case 'toggle':
          document.getElementById('hamburger3').classList.toggle('hamburger-toggle-left')
          break
        case 'reduce':
          document.getElementById('hamburger4').classList.toggle('hamburger-reduce')
          break
        default:
          break
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.hamburger-container{
  padding: 10px;
  .title{
    font-size: 20px;
    height: 50px;
  }
  .icons{
    display: flex;
    .item{
      margin-right: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .hamburger{
        font-size: 60px;
        display: inline-block;
        width: 1em;
        height: 1em;
        margin-top: 10px;
        padding: 0;
        cursor: pointer;
        transition: transform .2s ease-in-out;
        vertical-align: middle;
        border: 0 none;
        background: transparent;
      }
      /**
      * Button height fix for Firefox
      */
      .hamburger::-moz-focus-inner{
        padding: 0;
        border: 0 none;
      }
      /**
      * Focus fix for Chrome
      */
      .hamburger:focus {
        outline: 0;
      }
      .hamburger:before,
      .hamburger:after {
        content: "";
      }

      .hamburger:before,
      .hamburger .icon,
      .hamburger:after{
        display: block;
        width: 100%;
        height: .2em;
        margin: 0 0 .2em;
        transition: transform .2s ease-in-out;
        border-radius: .05em;
        background-color: #596c7d;
      }

      /**
      * Styles for the active `.hamburger` icon
      */
      .hamburger.active:before,
      .hamburger.active .icon,
      .hamburger.active:after{
        background: #596c7d;
      }


      /**
      * 90°翻转
      */
      .hamburger.hamburger-vertical.active{
        transform: rotate(90deg);
      }

      /**
      * 关闭、取消
      */
      .hamburger.hamburger-cancel.active .icon{
        transform: scale(0);
      }
      .hamburger.hamburger-cancel.active:before{
        transform: translateY(.4em) rotate(135deg);
      }
      .hamburger.hamburger-cancel.active:after{
        transform: translateY(-.4em) rotate(-135deg);
      }
      /**
      * 关闭/打开sidebar
      */
      .hamburger.hamburger-toggle-left.active .icon{
        transform-origin:left;
        transform: scaleX(.6);
      }
      .hamburger.hamburger-toggle-right .icon{
        transform-origin:right;
        transform: scaleX(.6);
      }
      /**
      * 加/减图标
      */
      .hamburger.hamburger-add.active .icon1{

      }
      .hamburger.hamburger-add.active .icon2{

      }
    }
  }
}
</style>
