import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 解决重复点击相同路由报错
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

// 常规引入组件
import Layout from '@/views/layout/index.vue'
import Home from '@/views/home/index.vue'
import Hamburger from '@/views/hamburger/index.vue'
import uploadFile from '@/views/uploadFile/index.vue'
import qrcode from '@/views/qrcode/index.vue'

const constantRoutes = [
  {
    path:'/login',
    name:'login',
    meta:{title:'登陆页面'},
    component:resolve => require(['@/views/login/index.vue'],resolve)
  },
  {
    path:'/',
    name:'layout',
    redirect:'/home',
    // 常规引用组件
    component:Layout,
    // 路由懒加载：路由配置如下，使用 resolve ，这样打包可以给每个页面单独生成一个js文件，从而减小访问页面时的体积，加快加载速度
    component: resolve => require(['@/views/layout/index.vue'],resolve),
    children: [
      {
        path:'/home',
        name:'home',
        meta:{title:'首页'},
        component:resolve => require(['@/views/home/index.vue'],resolve)
      },
      {
        path:'/hamburger',
        name:'hamburger',
        meta:{title:'Hamburger汉堡动态图'},
        component:resolve => require(['@/views/hamburger/index.vue'],resolve)
      },
      {
        path:'/uploadFile',
        name:'uploadFile',
        meta:{title:'uploadFile上传组件'},
        component:resolve => require(['@/views/uploadFile/index.vue'], resolve)
      },
      {
        path:'/qrcode',
        name:'qrcode',
        meta:{title:'二维码生成'},
        component:resolve => require(['@/views/qrcode/index.vue'], resolve)
      },
      {
        path:'/virtualScroll',
        name:'virtualScroll',
        meta:{title:'虚拟列表'},
        component:resolve => require(['@/views/virtualScroll/index.vue'], resolve)
      },
      {
        path:'/sliderCode',
        name:'sliderCode',
        meta:{title:'滑块验证'},
        component:resolve => require(['@/views/sliderCode/index.vue'], resolve)
      },
      {
        path:'/progress',
        name:'progress',
        meta:{title:'环形进度条'},
        component:resolve => require(['@/views/progress/index.vue'], resolve)
      },
      {
        path:'/cropperImage',
        name:'cropperImage',
        meta:{title:'图片剪切'},
        component:resolve => require(['@/views/cropperImage/index.vue'], resolve)
      },
      {
        path:'/downloadAnimation',
        name:'downloadAnimation',
        meta:{title:'下载动画'},
        component:resolve => require(['@/views/downloadAnimation/index.vue'], resolve)
      },
      {
        path:'/clock',
        name:'clock',
        meta:{title:'动态时钟'},
        component:resolve => require(['@/views/clock/index.vue'], resolve)
      },
      {
        path:'/echarts',
        name:'echarts',
        meta:{title:'ECharts图表'},
        component:resolve => require(['@/views/echarts/index.vue'], resolve)
      },
      {
        path:'/pdfDrag',
        name:'pdfDrag',
        meta:{title:'电子签约合同拖拽方案'},
        component:resolve => require(['@/views/espDrag/pdfSign.vue'], resolve)
      },
      {
        path:'/kaifangqian',
        name:'kaifangqian',
        meta:{title:'开放签'},
        component:resolve => require(['@/views/kaifangqian/index.vue'], resolve)
      },
      {
        path:'/tempDrag',
        name:'tempDrag',
        meta:{title:'模板拖拽'},
        component:resolve => require(['@/views/addDragTemplate/index.vue'], resolve)
      },
      {
        path:'/webSpeechApi',
        name:'webSpeechApi',
        meta:{title:'语音监听并合成文字'},
        component:resolve => require(['@/views/webSpeechApi/index.vue'], resolve)
      },
      {
        path:'/diff',
        name:'diff',
        meta:{title:'diff插件比对使用'},
        component:resolve => require(['@/views/diff/index.vue'], resolve)
      },
      {
        path:'/largeFileUpload',
        name:'largeFileUpload',
        meta:{title:'大文件切片上传'},
        component:resolve => require(['@/views/largeFileUpload/index.vue'], resolve)
      },
      {
        path:'/combinePdf',
        name:'combinePdf',
        meta:{title:'合并pdf'},
        component:resolve => require(['@/views/pdf/combinePdf.vue'], resolve)
      },
      {
        path:'/vue-draggable-resize',
        name:'vue-draggable-resize',
        meta:{title:'合并pdf'},
        component:resolve => require(['@/views/vue-draggable-resize/index.vue'], resolve)
      }
    ]
  }
]

const router = new Router({
  routes: constantRoutes
})

export default router
