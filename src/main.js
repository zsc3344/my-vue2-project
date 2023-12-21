import Vue from 'vue'
import App from './App.vue'
// import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'
import store from './store'
//main.js 中添加下面这行代码（路径和文件名按自己的来）
import '@/plugins/element.js'

Vue.config.productionTip = false

// 引入permission.js
import '@/utils/permission'

new Vue({
  el:'#app',
  router,
  store,
  render: h => h(App),
})
