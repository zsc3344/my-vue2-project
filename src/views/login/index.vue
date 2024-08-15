
<template>
  <div class="outside-login">
    <div class="welcome">
      <span class="title">您好，欢迎登录</span>
    </div>
    <div class="login-box">
      <el-form
        :model="params"
        ref="uForm"
        :rules="rules"
      >
      <el-form-item
            :required="true"
            label="用户名"
            label-width="130"
            prop="userName"
            class="form-item"
        >
          <el-input
              v-model="params.userName"
              placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item
            :required="true"
            label="密码"
            label-width="130"
            prop="password"
            class="form-item"
        >
          <el-input
              v-model="params.password"
              placeholder="请输入密码"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="btn-box">
        <a class="btn" @click="btnSubmit">登录</a>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/login.js'
import { getUserInfoById } from '@/api/user.js'
import { setToken } from '@/utils/auth'
export default {
  name:'Login',
  data() {
    return {
      option: null,
      params:{
        userName: null,
        password: null
      },
      rules: {
        userName: [{
          required: true,
          message: '请填写用户名',
          trigger: ['blur', 'change']
        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: ['blur', 'change']
        }]
      },
      isloading: null
    }
  },
  methods: {
    checkpassword(){
      if(this.params.password.length === 6){
        login(this.params).then(res => {
          if(res && res.data && res.data.uuid){
            setToken(res.data.uuid)
            this.$router.push({
              path:'/home'
            })
          }
        }).catch(error => {
          this.$message.error('账号不存在或密码错误请重试！')
        })
      }else if(this.params.password.length > 6){
        this.$message.error('密码输入错误,请重新输入！')
      }
    },
    btnSubmit() {
      this.$refs.uForm.validate(valid => {
        if (valid) {
          this.isloading = this.loadingShow();
          // this.checkpassword()
          login({
            userName:this.params.userName,
            password:this.params.password
          }).then(res => {
            if(res && res.data && res.data.data){
              this.$message({
                message: '登陆成功',
                type: 'success'
              })
              localStorage.setItem('token', res.data.data.token)
              this.$store.dispatch('user/setUserInfo', res.data.data)
              this.isloading().close;
              this.$router.push('/home')
            }else{
              this.$message({
                message: '登陆失败,请重新登陆',
                type: 'error'
              })
              this.isloading().close;
            }
          }).catch(error => {
            this.isloading().close;
          })
        }else{
          this.$message.error('请输入密码！')
        }
      })
    },
    loadingShow() {
      let loading = this.$loading({
        text: "Loading",  // 显示文本
        spinner: "el-icon-loading", // 显示的 icon
        background: "rgba(0, 0, 0, 0.7)", // loading 遮罩层颜色
        target: document.querySelector("body") // 挂载的 DOM 元素
      })
      // 返回的匿名函数
      return () => {
        // 匿名函数返回对象
        return {
          // 控制关闭 Loading 遮罩层
          close: loading.close()
        }
      }
    }
  },
  onReady() {
    // this.$refs.uForm.setRules(this.rules);
  }
}
</script>

<style lang="scss" scoped>
.outside-login {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #000000;
  // background-image: url('@/assets/login_back.png');
  background-repeat: no-repeat;
  background-size: 100%;
  box-sizing: border-box;
  padding: 15px 20px;
  overflow-y: scroll;
  .welcome{
    display: flex;
    flex-direction: column;
    margin: 100px auto 50px auto;
    .title{
      font-size: 28px;
      font-weight: 500;
      font-family: PingFangSC-Regular, sans-serif;
      line-height: 39px;
      color: #ffffff;
    }
    .tip{
      font-size: 15px;
      line-height: 15px;
      color: #7f7f7f;
      font-family: PingFangSC-Regular, sans-serif;
    }

  }
  .login-box{
    width: 500px;
    height: 350px;
    margin: 0 auto;
    background: #FFFFFF;
    box-shadow: 0px 1px 17px rgba(208, 214, 230, 0.4);
    border-radius: 20px;
    padding: 40px;
  }
  .form-item{
    // background-color: #F3F3F3;
    border-radius: 8px;
    margin-bottom: 20px;
    padding: 5px 15px;
  }
  .get-verify-code{
    font-size: 15px;
    color: #2F68FA;
  }
  .btn-box {
    margin-top: 40px;
    width: 100%;
    .btn {
      width: 400px;
      height: 50px;
      line-height: 50px;
      font-size: 15px;
      margin-bottom: 15px;
      border-radius: 5px;
      color: #ffffff;
      background-color: cornflowerblue;
      padding: 0 19px;
      display: flex;
      justify-content: center;
      cursor: pointer;
    }
  }
  .bottom-tip{
    width: 100%;
    position: absolute;
    bottom: 15px;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
}
</style>
