export const menuOptions = [
  {
    index:'1',
    route:'/home',
    menuName:'首页',
    type:'page'
  },
  {
    index:'2',
    route:'/componentsPage',
    menuName:'组件库',
    type:'menu',
    children:[
      {
        index:'2-1',
        route:'/componentsPage/hamburger',
        menuName:'Hamburger汉堡动态图',
      },
      {
        index:'2-2',
        route:'/componentsPage/uploadFile',
        menuName:'uploadFile上传组件',
      },
      {
        index:'2-3',
        route:'/componentsPage/qrcode',
        menuName:'二维码生成',
      },
      {
        index:'2-4',
        route:'/componentsPage/virtualScroll',
        menuName:'虚拟列表',
      },
      {
        index:'2-5',
        route:'/componentsPage/sliderCode',
        menuName:'滑块验证',
      },
      {
        index:'2-6',
        route:'/componentsPage/progress',
        menuName:'环形进度条',
      },
      {
        index:'2-7',
        route:'/componentsPage/cropperImage',
        menuName:'图片剪切',
      },
      {
        index:'2-8',
        route:'/componentsPage/downloadAnimation',
        menuName:'下载动画',
      },
      {
        index:'2-9',
        route:'/componentsPage/clock',
        menuName:'动态时钟',
      },
      {
        index:'2-10',
        route:'/componentsPage/wangEditor',
        menuName:'wangEditor编辑器',
      },
      {
        index:'2-11',
        route:'/componentsPage/waterfallFlow',
        menuName:'小红书瀑布流',
      }
    ]
  },
  {
    index:'3',
    route:'/toolsPage',
    menuName:'功能库',
    type:'menu',
    children:[
      {
        index:'3-1',
        route:'/toolsPage/echarts',
        menuName:'ECharts图表',
      },
      {
        index:'3-2',
        route:'/toolsPage/pdfDrag',
        menuName:'电子签约合同拖拽方案',
      },
      {
        index:'3-3',
        route:'/toolsPage/kaifangqian',
        menuName:'开放签',
      },
      {
        index:'3-4',
        route:'/toolsPage/tempDrag',
        menuName:'电子签模板拖拽',
      },
      {
        index:'3-5',
        route:'/toolsPage/webSpeechApi',
        menuName:'语音监听并合成文字',
      },
      {
        index:'3-6',
        route:'/toolsPage/diff',
        menuName:'diff插件比对使用',
      },
      {
        index:'3-7',
        route:'/toolsPage/largeFileUpload',
        menuName:'大文件切片上传',
      },
      {
        index:'3-8',
        route:'/toolsPage/combinePdf',
        menuName:'合并pdf',
      },
      {
        index:'3-9',
        route:'/toolsPage/vue-draggable-resizable',
        menuName:'vue-draggable-resizable插件使用',
      },
      {
        index:'3-10',
        route:'/toolsPage/driverjs',
        menuName:'页面引导driver.js使用',
      },
      {
        index:'3-11',
        route:'/toolsPage/pictureToPicture',
        menuName:'前端画中画实现',
      }
    ]
  }
]
