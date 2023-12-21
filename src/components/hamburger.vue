<template>
  <div class="hamburger-container">
    <div class="icons">
      <div class="item">
        <el-button id="hamburger" class="hamburger hamburger-toggle-left" @click="change('toggle')">
          <div class="icon-div">
            <span class="icon"></span>
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
    change(value){
      switch(value){
        case 'toggle':
          document.getElementById('hamburger').classList.toggle('hamburger-toggle-right')
          this.$emit('toggle')
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
  height: 60px;
  display: flex;
  align-items: center;
  .icons{
    display: flex;
    .item{
      margin-right: 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .hamburger{
        font-size: 15px;
        display: inline-block;
        width: 1em;
        height: 1em;
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
        background-color: rgb(54,54,54);
      }

      /**
      * Styles for the active `.hamburger` icon
      */
      .hamburger.active:before,
      .hamburger.active .icon,
      .hamburger.active:after{
        background: rgb(54,54,54);
      }
      /**
      * 关闭/打开sidebar
      */
      .hamburger.hamburger-toggle-left .icon{
        transform-origin:left;
        transform: scaleX(.6);
      }
      .hamburger.hamburger-toggle-right.active .icon{
        transform-origin:right;
        transform: scaleX(.6);
      }
    }
  }
}
</style>
