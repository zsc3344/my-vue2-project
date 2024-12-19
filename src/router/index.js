import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 解决重复点击相同路由报错
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

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
    // 路由懒加载：路由配置如下，使用 resolve ，这样打包可以给每个页面单独生成一个js文件，从而减小访问页面时的体积，加快加载速度
    component: resolve => require(['@/views/layout/index.vue'],resolve),
    children: [
      // 组件库
      {
        path:'/home',
        name:'home',
        meta:{title:'首页'},
        component:resolve => require(['@/views/home/index.vue'],resolve)
      }
    ]
  },
  {
    path:'/componentsPage',
    name:'layout',
    redirect:'/home',
    // 常规引用组件
    // 路由懒加载：路由配置如下，使用 resolve ，这样打包可以给每个页面单独生成一个js文件，从而减小访问页面时的体积，加快加载速度
    component: resolve => require(['@/views/layout/index.vue'],resolve),
    children: [
      // 组件库
      {
        path:'hamburger',
        name:'hamburger',
        meta:{title:'Hamburger汉堡动态图'},
        component:resolve => require(['@/views/componentsPage/hamburger/index.vue'],resolve)
      },
      {
        path:'uploadFile',
        name:'uploadFile',
        meta:{title:'uploadFile上传组件'},
        component:resolve => require(['@/views/componentsPage/uploadFile/index.vue'], resolve)
      },
      {
        path:'qrcode',
        name:'qrcode',
        meta:{title:'二维码生成'},
        component:resolve => require(['@/views/componentsPage/qrcode/index.vue'], resolve)
      },
      {
        path:'virtualScroll',
        name:'virtualScroll',
        meta:{title:'虚拟列表'},
        component:resolve => require(['@/views/componentsPage/virtualScroll/index.vue'], resolve)
      },
      {
        path:'sliderCode',
        name:'sliderCode',
        meta:{title:'滑块验证'},
        component:resolve => require(['@/views/componentsPage/sliderCode/index.vue'], resolve)
      },
      {
        path:'progress',
        name:'progress',
        meta:{title:'环形进度条'},
        component:resolve => require(['@/views/componentsPage/progress/index.vue'], resolve)
      },
      {
        path:'cropperImage',
        name:'cropperImage',
        meta:{title:'图片剪切'},
        component:resolve => require(['@/views/componentsPage/cropperImage/index.vue'], resolve)
      },
      {
        path:'downloadAnimation',
        name:'downloadAnimation',
        meta:{title:'下载动画'},
        component:resolve => require(['@/views/componentsPage/downloadAnimation/index.vue'], resolve)
      },
      {
        path:'clock',
        name:'clock',
        meta:{title:'动态时钟'},
        component:resolve => require(['@/views/componentsPage/clock/index.vue'], resolve)
      },
      {
        path:'wangEditor',
        name:'wangEditor',
        meta:{title:'wangEditor编辑器'},
        component:resolve => require(['@/views/componentsPage/wangEditor/index.vue'], resolve)
      }
    ]
  },
  {
    path:'/toolsPage',
    name:'layout',
    // 常规引用组件
    // 路由懒加载：路由配置如下，使用 resolve ，这样打包可以给每个页面单独生成一个js文件，从而减小访问页面时的体积，加快加载速度
    component: resolve => require(['@/views/layout/index.vue'],resolve),
    children: [
      // 功能库
      {
        path:'echarts',
        name:'echarts',
        meta:{title:'ECharts图表'},
        component:resolve => require(['@/views/toolsPage/echarts/index.vue'], resolve)
      },
      {
        path:'pdfDrag',
        name:'pdfDrag',
        meta:{title:'电子签约合同拖拽方案'},
        component:resolve => require(['@/views/toolsPage/espDrag/pdfSign.vue'], resolve)
      },
      {
        path:'kaifangqian',
        name:'kaifangqian',
        meta:{title:'开放签'},
        component:resolve => require(['@/views/toolsPage/kaifangqian/index.vue'], resolve)
      },
      {
        path:'tempDrag',
        name:'tempDrag',
        meta:{title:'电子签模板拖拽'},
        component:resolve => require(['@/views/toolsPage/addDragTemplate/index.vue'], resolve)
      },
      {
        path:'webSpeechApi',
        name:'webSpeechApi',
        meta:{title:'语音监听并合成文字'},
        component:resolve => require(['@/views/toolsPage/webSpeechApi/index.vue'], resolve)
      },
      {
        path:'diff',
        name:'diff',
        meta:{title:'diff插件比对使用'},
        component:resolve => require(['@/views/toolsPage/diff/index.vue'], resolve)
      },
      {
        path:'largeFileUpload',
        name:'largeFileUpload',
        meta:{title:'大文件切片上传'},
        component:resolve => require(['@/views/toolsPage/largeFileUpload/index.vue'], resolve)
      },
      {
        path:'combinePdf',
        name:'combinePdf',
        meta:{title:'合并pdf'},
        component:resolve => require(['@/views/toolsPage/pdf/combinePdf.vue'], resolve)
      },
      {
        path:'vue-draggable-resizable',
        name:'vue-draggable-resizable',
        meta:{title:'vue-draggable-resizable插件使用'},
        component:resolve => require(['@/views/toolsPage/vue-draggable-resize/index.vue'], resolve)
      },
      {
        path:'driverjs',
        name:'driverjs',
        meta:{title:'页面引导driver.js使用'},
        component:resolve => require(['@/views/toolsPage/driverjs/index.vue'], resolve)
      },
      {
        path:'pictureToPicture',
        name:'pictureToPicture',
        meta:{title:'前端画中画实现'},
        component:resolve => require(['@/views/toolsPage/pictureToPicture/index.vue'], resolve)
      }
    ]
  }
]

const router = new Router({
  routes: constantRoutes
})

export default router
