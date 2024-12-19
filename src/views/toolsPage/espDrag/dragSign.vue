<template>
  <el-row class="treaty">
    <el-col :span="3" class="pageList">
      <p class="pageTitle">
        页码切换
      </p>
      <div ref="pagePanel" class="pagePanel">
        <div v-for="(item, index) in imgList" :key="index" class="item" :class="{on: index == selectPage }" @click="selectItem(index)">
          <img :src="`data:image/png;base64,${item.url}`">
          <p>
            {{ index+1 }}
          </p>
        </div>
      </div>
    </el-col>
    <el-col :span="17">
      <div ref="docContainer" class="imgListpanel">
        <div class="imgpanel">
          <div v-for="(docItem, docindex) in imgList" :key="docindex" ref="docItem" class="imgList" @drop="drop($event, docindex+1)" @dragover="allowDrop($event)">
            <img :src="`data:image/png;base64,${docItem.url}`">
          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="4">
      <div class="rightPanel">
        <div class="item">
          <p class="title">
            发起人
          </p>
          <p>
            {{ initiatorLoginName }}
            <span class="on">
              {{ contractStatus(contractDetail.status) }}
            </span>
          </p>
        </div>
        <template v-if="contractDetail.contractType === '01'">
          <div class="item">
            <p class="title">
              签署人
            </p>
            <div v-for="(singItem, index) in signPersonList" :key="index">
              <p>
                {{ singItem.participantLoginName }}
                <span :class="{on: singItem.operationResult === '01' }">
                  {{ singItem.operationResult ? operationResultStatus[singItem.operationResult] : '未签署' }}
                </span>
              </p>
              <p>
                {{ signPersonList[index].instName }}
              </p>
              <p class="line" />
            </div>
          </div>
          <div v-if="optype === 'sign'" class="item">
            <p class="title">
              签章
            </p>
            <div v-if="signStr">
              <p class="fic">
                拖拽签章到合同中
              </p>
              <div class="dropDom" draggable="true" @dragstart="drag($event)">
                <img :src="`${signStr}`">
                <span>
                  <i type="el-icon-circle-close" style="cursor: pointer;" />
                </span>
              </div>
            </div>
            <div v-else style="text-align: center;">
              <p class="fic">
                暂无签章，请先上传
              </p>
              <Button type="ghost" @click="toSignatureManege">
                立即上传
              </Button>
            </div>
          </div>
        </template>
      </div>
    </el-col>
  </el-row>
</template>
<script>
// import tool from '@/utils/tool'
 
let dom = null
export default {
  name: 'TreatyContentPreview',
 
  directives: {
    drag (el) {
      el.onmousedown = (e) => {
        let disx = e.pageX - el.offsetLeft
        let disy = e.pageY - el.offsetTop
        e.preventDefault()
        document.onmousemove = (e) => {
          el.style.left = e.pageX - disx + 'px'
          el.style.top = e.pageY - disy + 'px'
          e.preventDefault()
        }
        document.onmouseup = () => {
          document.onmousemove = document.onmouseup = null
        }
      }
    }
  },
 
  props: {
    imgList: {
      type: Array,
      default: () => { return [] }
    },
    optype: {
      type: String,
      default: 'sign'
    },
    initiatorLoginName: {
      type: String,
      default: 'chris'
    },
    signStr: {
      type: String,
      default: require('@/assets/sign.png')
    },
    contractDetail: {
      type: Object,
      default: () => { return {
        status:'01',
        contractType:'01'
      }
    }
    },
    signPersonList: {
      type: Array,
      default: () => { return [
        {
          operationResult:'01',
          instName:'chris'
        }
      ] 
    }
    }
  },
 
  data () {
    return {
      selectPage: 0,
      mouseInSealX: 0,
      mouseInSealY: 0,
      operationResultStatus: {
        '01': '已签署',
        '02': '拒签',
        '03': '已撤销'
      },
      sealWidth: 0,
      sealHeight: 0,
      pt_y: 842, // pdf 的磅宽
      pt_x: 595, // pdf 的磅高
      signaturelocation: null
    }
  },
 
  computed: {
    docWidth () {
      return this.$refs.docItem[0].offsetWidth
    },
    docHeight () {
      return this.$refs.docItem[0].offsetHeight
    },
    naturalWidth () {
      return this.$refs.docItem[0].children[0].naturalWidth
    },
    naturalHeight () {
      return this.$refs.docItem[0].children[0].naturalHeight
    }
  },
 
  watch: {
    selectPage (oldVal, newVal) {
      console.log(oldVal + 'qss' + newVal)
    }
  },
 
  activated () {
    this.sealWidth = 0
    dom = null
    // 监听这个dom的scroll事件
    this.$refs.docContainer.addEventListener('scroll', () => {
      let step = this.$refs.docContainer.scrollHeight / this.imgList.length
      let scrollTop = this.$refs.docContainer.scrollTop
      if (Math.round(scrollTop / step) < this.imgList.length) {
        this.selectPage = Math.round(scrollTop / step)
      }
 
      let pageStep = this.$refs.pagePanel.scrollHeight / this.imgList.length
      this.$refs.pagePanel.scrollTop = pageStep * this.selectPage
    }, false)
  },
 
  beforeDestroy () {
    this.sealWidth = 0
    dom = null
  },
 
  methods: {
    contractStatus (status) {
      let statusText = {
        '01': '草稿',
        '02': '用印中',
        '03': '签约完成',
        '04': '拒签',
        '05': '已撤销',
        '06': '已过期',
        '07': '文件归档',
        '08': '文件作废'
      }
 
      let returnList = ['02', '05', '07', '08']
      if (returnList.indexOf(status) !== -1) {
        // 电子签约
        if (status === '05') {
          return '已撤销'
        }
        if (this.contractDetail.contractType === '01') {
          return ''
        }
        return statusText[status]
      } else {
        return ''
      }
    },
    removeElement (_element) {
      let _parentElement = _element.parentNode
      if (_parentElement) {
        _parentElement.removeChild(_element)
      }
    },
    toSignatureManege () {
      this.$router.push({ path: '/account/signatureManege', query: { backPath: '/contract/list', menuName: 'SignatureManege' } })
    },
    iconClick () {
      if (dom) {
        // dom.remove()
        this.removeElement(dom)
        dom = null
        this.signaturelocation = null
      }
    },
    drag (event) {
      if (dom) {
        // dom.remove()
        this.removeElement(dom)
        dom = null
        this.signaturelocation = null
      }
      let scale = this.naturalWidth / this.docHeight
      dom = event.currentTarget.cloneNode(true)
      this.mouseInSealX = event.offsetX
      this.mouseInSealY = event.offsetY
      this.sealWidth = event.currentTarget.offsetWidth / scale
      this.sealHeight = event.currentTarget.offsetHeight / scale
      // 30 和 50 是 外框边距。用于删除
      this.sealWidth = dom.children[0].naturalWidth / scale + 50
      this.sealHeight = dom.children[0].naturalHeight / scale + 30
    },
    drop (event, index) {
      if (this.optype !== 'sign') {
        return false
      }
      event.preventDefault()
      let target = event.currentTarget
      // let docWidth = this.$refs.docItem.offsetWidth
      // docOffsetLeft 文档到docment的offsetLeft
      let docOffsetLeft = target.style.left
      let docOffsetTop = target.style.top
      let scrollTop = this.$refs.docContainer.scrollTop
 
      // inDocLeft 签章在doc中的left
      let inDocLeft = event.clientX - docOffsetLeft - this.mouseInSealX
      // inDocTop 签章在doc中的top
      let inDocTop = event.clientY - (docOffsetTop - scrollTop) - this.mouseInSealY
      dom.style.position = 'absolute'
      dom.style.left = inDocLeft + 'px'
      dom.style.top = inDocTop + 'px'
      dom.children[1].style.display = 'block'
      dom.style.width = this.sealWidth + 'px'
      dom.style.height = this.sealHeight + 'px'
 
      // 以当前页面左下角位原点 ，取 左下角 （offsetX，offsetY） 右上角 （locationX，locationY）
      let offsetX = inDocLeft
      let offsetY = this.docHeight - (inDocTop + this.sealHeight)
      console.log('(' + offsetX + ',' + offsetY + ')')
      // 30 和 50 是 外框边距
      this.signaturelocation = {
        locationX: ((offsetX + this.sealWidth - 25) / this.docWidth * this.pt_x).toFixed(0),
        locationY: ((offsetY + this.sealHeight - 15) / this.docHeight * this.pt_y).toFixed(0),
        offsetX: ((offsetX + 25) / this.docWidth * this.pt_x).toFixed(0),
        offsetY: ((offsetY + 15) / this.docHeight * this.pt_y).toFixed(0),
        signMode: '1',
        signOnPage: index.toString()
      }
      console.log(this.signaturelocation)
      let isAdd = (this.signaturelocation.locationX <= 0 || this.signaturelocation.locationX >= this.pt_x ||
        this.signaturelocation.locationY <= 0 || this.signaturelocation.locationY >= this.pt_y ||
        this.signaturelocation.offsetX <= 0 || this.signaturelocation.offsetX >= this.pt_x ||
        this.signaturelocation.offsetY <= 0 || this.signaturelocation.offsetY >= this.pt_y)
      if (isAdd) {
        this.$Message.error('签章不在合同内部')
        // dom.remove()
        this.removeElement(dom)
        dom = null
        return false
      }
      if (event.target.parentElement && this.sealWidth) {
        dom.children[1].addEventListener('click', () => {
          this.iconClick()
        })
        event.target.parentElement.appendChild(dom)
      } else {
        console.log(event)
      }
    },
    allowDrop (event) {
      event.preventDefault()
    },
    selectItem (index) {
      this.selectPage = index
      let step = this.$refs.docContainer.scrollHeight / this.imgList.length
      this.$refs.docContainer.scrollTop = index * step
    },
    getSubmitData () {
      let data = {
        'locationX': '250',
        'locationY': '380',
        'offsetX': '100',
        'offsetY': '250',
        'signMode': '1',
        'signOnPage': '1'
      }
      if (data) {
        return this.signaturelocation
      }
    }
  }
}
</script>
 
<style lang='scss' scoped>
.treaty {
  width:100%;
  .pageList {
    padding-top:10px;
    text-align: center;
    .pageTitle {
      text-align: left;
      border-bottom:1px solid #E3E3E3;
      display:inline-block;
      height: 28px;
      line-height:28px;
      margin-bottom:10px;
      width:80px;
    }
 
    .pagePanel {
      height: calc(100vh - 176px);
      text-align: center;
      overflow: auto;
      overflow-x: hidden;
 
      .item {
          width: 78px;
          height: 92px;
          text-align: center;
          margin: 0px auto 8px auto;
          border: 1px solid #EBEBEB;
          position: relative;
          img {
            width: 100%;
            height: 100%;
            float:left;
          }
          > p {
            position: absolute;
            top:73px;
            left:0;
            float:left;
            text-align: center;
            width:100%;
            height:18px;
            font-size: 12px;
            color: #FFFFFF;
            letter-spacing: 0;
            opacity: 0.4;
            background: #626262;
          }
          &.on {
            border: 1px solid #92D2CC;
            >p{
                opacity: 0.5;
                background: #24A599;
            }
          }
        }
      }
    }
 
    .imgListpanel{
      height: calc(100vh - 132px);
      text-align:center;
      overflow:auto;
      overflow-x:hidden;
      .imgpanel{
        width:100%;
        margin:0 auto
      }
      .imgList{
        display:inline-block;
        zoom: 1;
        text-align: center;
        position: relative;
        width:100%;
        float:left;
 
        img{
          width: 100%;
          height: 100%;
          float:left;
        }
        .dropDom{
          padding: 15px 25px;
          background: transparent;
          border:1px solid #EDEDED;
          >span{
            width: 30px;
            height: 30px;
            position: absolute;
            right: -15px;
            top: -12px;
            font-size: 16px;
          }
        }
      }
    }
    .dropDom{
      padding: 15px 25px;
      background:#fff;
      >span{
          display:none
      }
    }
 
    .rightPanel {
      height: calc(100vh - 132px);
      overflow:auto;
      overflow-x:hidden;
      padding: 10px 18px;
      .item {
        min-height:100px;
 
        .title {
          font-size: 14px;
          color: #292929;
          width: 100%;
          border-bottom: 1px solid #E3E3E3;
          display: inline-block;
          height: 30px;
          line-height:30px;
          margin-bottom: 10px;
        }
        p {
          font-size: 12px;
          color: #666666;
          padding-bottom: 5px;
          &.fic {
            color: #999;
            text-align: center;
          }
        }
        .line{
          height:10px;
          border-bottom: 1px solid #E3E3E3;
          margin-bottom: 10px;
        }
        span{
          font-size: 12px;
          color:#999;
          float:right;
          &.on { color: #4ED5A4; }
        }
    }
  }
}
</style>