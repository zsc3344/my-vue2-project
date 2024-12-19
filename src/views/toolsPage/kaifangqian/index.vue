<template>
  <div id="elesign" class="elesign">
    <div class="row-container">
      <!-- 左侧拖拽栏 -->
      <div class="left-box" style="margin-top:1%;padding: 0 10px;">
        <div class="sign-signer">
          <div class="configure-title">
            <span>签署方</span>
          </div>
          <div class="signer-list">
            <ul>
              <draggable :list="thisControlList"  handle=".control-move" filter=".unmover"  item-key="name"
                  :force-fallback="true"  animation="300" @end="controlsDragOver"
                  :group="groupOut" :fallback-class="true" :fallback-on-body="true" :touch-start-threshold="50"
                  :fallback-tolerance="50" :clone="clone" :sort="false" drag-class="drag-class">
                <template v-for="element in thisControlList">
                  <div>
                    <li class="unmover li-style" v-if="element.type== 'seal'">电子印章-{{element.user.userName?element.user.userName:'未制作印章'}}</li>
                    <li class="unmover li-style" v-if="element.type== 'signature'">手写签名-{{element.user.userName?element.user.userName:'未手写签名'}}</li>
                    <li class="unmover li-style" v-else>{{element.title}}</li>
                    <li  :class="['li-entp-seal',controlClass(element)]">
                      <div class="entp-seal item" v-if="element.type== 'seal'" @click="openModal(element)">
                        <img :src="'data:image/png;base64,'+element.value" v-if="element.value"/>
                        <span v-else>请先制作印章</span>
                      </div>
                      <div class="person-seal item" v-if="element.type== 'signature'" @click="openModal(element)">
                        <img :src="'data:image/png;base64,'+element.value" v-if="element.value"/> 
                        <span v-else>请先设置手写签名</span>
                      </div>
                      <div class="inputArea-seal item" v-if="element.type == 'inputArea'">
                        <!-- <input v-model="element.value" type="text"> -->
                        <!-- <img :src="element.value" v-if="element.value"/>  -->
                        <span>{{ element.name }}</span>
                      </div>
                    </li>
                  </div>
                </template> 
              </draggable>
            </ul>
          </div>
        </div>
      </div>
      <!-- 中间文档内容，拖拽区域 -->
      <div class="sign-content">
        <c-scrollbar>
          <div class="document-content">
            <div id="document-list" class="document-list" :style="[
              {'height': (CanvasZoom.height * documentPDF.images.length + documentPDF.images.length * 16) +'px'}
            ]" v-if="documentPDF && documentPDF.images">
              <template v-for="item in documentPDF.images">
                <div class="document-page group"  v-if="item"
                  :style="'transform: translate(0,'+(item.docPage * CanvasZoom.height + (item.docPage+1) * 16)+'px);'">
                  <img style="width: 100%;" :src="item.image"/>
                </div>
              </template>
              <draggable :list="documentPDF.control" ghost-class="ghost" draggable=".test"
                item-key="uid"
                :group="groupEnter" :force-fallback="true" chosen-class="chosenClass" animation="300"
                :fallback-class="true" :fallback-on-body="true" :touch-start-threshold="50"
                :fallback-tolerance="50"
                style="width: 100%;height: 100%;position: relative;" @change="dragChange">
                <template v-for="item in documentPDF.control" >
                  <ControlItem :doc="item" :element="item" :isSign="false"
                    @controlDelete="controlDelete" @focusInput="focusInput"/>
                </template>
              </draggable>
            </div>
          </div>
         </c-scrollbar> 
        </div>
      <!-- 右侧编辑区域 -->
      <div class="right-box" style="margin-top:1%;padding: 0 10px;">
        <div class="config-area" style="margin-bottom:2%;">
          <template v-if="currentFocusElement.editType && currentFocusElement.editType === 'input'">
            <span>设置{{ currentFocusElement.title }}</span>
            <div class="edit-area">
              <el-form :model="currentFocusElement.editInfo" :rules="editRules" ref="ruleForm" label-position="top" label-width="100px" class="demo-ruleForm">
                <el-form-item label="文本框名称" prop="label">
                  <el-input v-model="currentFocusElement.editInfo.label"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm('ruleForm')">保存为新定义控件</el-button>
                </el-form-item>
              </el-form>
            </div>
          </template>
        </div>
      </div>
      <!-- 右侧预览区域 -->
      <div class="right-box" style="margin-top:1%;padding: 0 10px;">
        <div class="config-area" style="margin-bottom:2%;">
          <template>
            <span>预览文件</span>
            <div class="preview-area">

            </div>
          </template>
        </div>
      </div>
    </div>
    <!-- 底部操作区域 -->
    <div class="operate-box">
      <el-button class="btn-outline-dark" @click="preStep()"> 上一步</el-button>
      <el-button class="btn-outline-dark" @click="nextStep()"> 下一步</el-button>
      <el-button class="btn-outline-dark" @click="signDocument()">保存模板</el-button>
    </div>
  </div>
</template>
<script>
import draggable from "vuedraggable"

import image1 from "./assets/images/doc_1.png"
import image2 from "./assets/images/doc_2.png"
import { CanvasZoom, controlList, ControlType } from './components/control/data/ControlData'
import {moveRange,currentPosition} from './components/control/data/ControlerMoveRange'
import { controlArray } from './assets/control'
import ControlItem from './components/control/ControlItem.vue'
import { canvasToPdf, imageToPdf, MultiHtmlToCanvas } from '@/utils/util'  
import { doPost } from "@/api/kaifangqian"

export default {
  components: {
    draggable,
    ControlItem
  },
  data() {
    return {
      CanvasZoom: JSON.parse(JSON.stringify(CanvasZoom)),
      thisControlList: JSON.parse(JSON.stringify(controlList)),
      mainImagelist: [],
      spinning: false,
      //签署相关的属性
			signData: {
				signType:1,
				entKeyword:"",
				personalKeyword:"",
				entName:"",
				personalName:"",
				entSeal:"",
				personalSeal:"",
				entPositionList:[],
				personalPositionList:[]
				
			},
      documentPDF: {
				images:[
					{
						docPage:0,
						image:image1,
					},
					{
						docPage:1,
						image:image2,
					},
				],
        control: [
    {
        "icon": "seal",
        "name": "电子印章",
        "title": "企业签章",
        "type": "seal",
        "placeholder": "",
        "value": "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",
        "zoom": false,
        "move": true,
        "size": {
            "width": 160,
            "height": 160,
            "minWidth": 160,
            "minHeight": 160
        },
        "position": {
            "left": 620,
            "top": 2112,
            "page": 1,
            "x": 100,
            "y": 100
        },
        "user": {
            "index": -1,
            "userName": "一页科技"
        },
        "uid": "47d56d3",
        "pageSize": 2,
        "controlClick": true
    }
]
			},
      //控件移出移入的配置
			groupOut: {
				name: "itxst",
				put: false,
				pull:'clone', //允许拖出
			},
      groupEnter: {
				name: "itxst",
				put: true, //允许拖入
				pull:false, //允许拖出
			},
      currentFocusElement: {},
      editRules: {
        label: [
          { required: true, message: '设置输入项名称(如甲方姓名等)', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      successVisible: false,
			errorVisible: false,
			errorMsg: ""
    }
  },
  created(){
    this.thisControlList = JSON.parse(JSON.stringify(controlList))
    this.mainImagelist = [require('@/assets/sign.png'),require('@/assets/seal.png')]
  },
  methods: {
    //深度克隆控件对象
    clone(origin){
      const data = JSON.parse(JSON.stringify(origin))
      data.position.x=100;
      data.position.y=100;
      data.uid = parseInt(new Date().getMilliseconds() + "" + Math.ceil(Math.random() * 100000)).toString(16);
      data.pageSize = this.documentPDF.images.length;
      return data;
    },
    //控件完成拖动触发事件
    controlsDragOver(e){
      const moveTarget = this.documentPDF.control[e.newIndex];
      if(e.pullMode){
        const opt = {
          x:e.originalEvent.offsetX - (moveTarget.size.width/2),
          y:e.originalEvent.offsetY - (moveTarget.size.height/2),
          pageSize: this.documentPDF.images.length,
          size:moveTarget.size,
          currentPage:0,
        };
        moveRange(opt);
        this.documentPDF.control[e.newIndex].position.left = opt.x
        this.documentPDF.control[e.newIndex].position.top = opt.y
        this.documentPDF.control[e.newIndex].position.page = opt.currentPage;
        this.documentPDF.control[e.newIndex].controlClick = true;
      }
    },
    //删除已拖动至文档中的控件
    controlDelete(element){
      this.documentPDF.control = this.documentPDF.control.filter((item) => {
        return item.uid !== element.uid 
      })
    },
    // 鼠标点击在文档中的控件上
    focusInput(element){
      this.currentFocusElement = {...element}
    },
    /**
     * 判断控件的class  是否可进行拖动
     */
    controlClass(element){
      if(element.type == 'seal' && this.signData.signType == 1 && this.thisControlList[0]){
        return "control-move";
      }else if(element.type == 'signature' && this.signData.signType == 1 && this.thisControlList[1]){
        return  "control-move";
      }else if(element.type == 'inputArea' && this.signData.signType == 1){
        return  "control-move";
      }else{
        return "control-disabled";
      }
      //return  "control-move";
    },
    /**
     * 签署类型切换
     */
    signTypeChange(val){
      if(this.signData.signType == 2){
        this.documentPDF.control = [];
      }
    },
    /**
     * 调用文件签署接口进行签署  并返回签署后的PDF文件
     */
		signDocument(){
      // signSuccessTips();
      if(this.signData.signType == 1 && this.documentPDF.control.length == 0){
        message.warning("您尚未为电子印章/手写签名指定签署位置，请设置后再签署");
        return;
      }
      // console.log(signData.signType == 2 && (!signData.entKeyword  || !signData.personalKeyword));
      //判断如果是关键字签署类型  必须设置一个关键字
      if(this.signData.signType == 2 && !(this.signData.entKeyword  || this.signData.personalKeyword)){
        this.$message.warning("您尚未设置关键字，请准确设置关键字后再签署");
        return;
      }
      //如果设置了电子印章关键字 必须设置印章才能提交
      if(this.signData.signType == 2 && this.signData.entKeyword && !this.signData.entSeal ){
        this.$message.warning("尚未制作电子印章，请先制作电子印章后再签署");
        return;
      }
      //如果设置了手写前面关键字 必须设置签名才能提交
      if(this.signData.signType == 2 && this.signData.personalKeyword && !this.signData.personalSeal ){
        this.$message.warning("尚未设置手写签名，请先设置手写签名后再签署");
        return;
      }
      this.spinning = true;
      this.signData.entPositionList = [];
      this.signData.personalPositionList = [];
      console.log('===this.documentPDF.control===', this.documentPDF.control)
      //将签名控件的位置转换为签署所需的坐标
      this.documentPDF.control.forEach(item=>{
        const temItem = {
          width: item.size.width,
          height:item.size.height,
          offsetX: item.position.left,
          offsetY: currentPosition(item.position.top,item.position.page),
          page: item.position.page + 1,
          pageHeight: this.CanvasZoom.height,
          pageWidth: this.CanvasZoom.width,
        };
        if(item.type == ControlType.Seal){
          this.signData.entPositionList.push(temItem)
        }else if(item.type == ControlType.Signature){
          this.signData.personalPositionList.push(temItem)
        }
      })
      console.log('===this.signData.personalPositionList===', this.signData.personalPositionList)
      console.log('===this.signData.entPositionList===', this.signData.entPositionList)
      //调用签署接口
      doPost(this.signData).then(res=>{
        console.log("sign res:",res);
        if(res.code == 200){
          saveBlob(base64ToBlob(res.result.signFile),new Date().getTime()+'.pdf');
          // signSuccessTips();
          this.successVisible = true;
        }else{
          this.errorMsg = res.message;
          this.errorVisible = true;
        }
        this.spinning = false;
      });
    },
    dragChange(event){
    },
    // 上一步
    preStep(){

    },
    // 下一步
    nextStep(){

    },
    // 保存pdf
    saveTemplate(){
      let pdfContainer = document.getElementById('document-list')
      MultiHtmlToCanvas(pdfContainer, this.CanvasZoom)
    }
  }
}
</script>
<style scoped lang="scss">
.elesign {
  display: flex;
  height: 100%;
  // flex: 1;
  flex-direction: column;
  position: relative;
  background-color: #f8f8fa;
  margin: auto;
  .row-container{
    height: 100%;
    display: flex;
    flex-direction: row;
    .left-box{
      width: 15%;
    }
    .sign-content{
      // flex: 1;
      width: 70%;
      height: 96%;
      min-width: 800px;
      border-left: 1px solid #e3e3e3;
      border-right: 1px solid #e3e3e3;
      background-color: #f1f1f1;
      padding: 20px 0;
      box-sizing: border-box;
      .document-content{
        flex:1;
        height: 100%;
      }
      .document-list{
        position: relative;
        margin: 0 auto;
        width: 800px;
      }
      .document-page{
        position: absolute;
      }
    }
    .right-box{
      width: 15%;
      .config-area {
        display: flex;
        flex-direction: column;
        .edit-area{ 
          display: flex;
          flex-direction: column;
          background-color: #ffffff;
          padding: 10px;
        }
        .preview-area{
          display: flex;
          flex-direction: column;
          background-color: #ffffff;
          padding: 10px;
          height: 100%;
        }
        .btn-outline-dark {
          color: #0f1531;
          background-color: transparent;
          background-image: none;
          border:1px solid #3e4b5b;
          margin: 10px;
        }
        .btn-outline-dark:hover {
          color: #fff;
          background-color: #3e4b5b;
          border-color: #3e4b5b;
        }
      }
    }
  }
  .operate-box{
    position: absolute;
    bottom: -20px;left: 0;right: 0;
    height: 60px;
    background-color: #fefefe;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}

.signer-list ul,.mode-keyword ul{
  padding: 0;
}
.signer-list li,.mode-keyword li{
  list-style: none;
  padding: 0.02rem 0;
}
.signer-list .li-style::before,.mode-keyword .li-style::before{
  content: "";
    width: 0.06rem;
    height: 0.06rem;
    display: inline-block;
    border-radius: 50%;
    background: #999;
    vertical-align: middle;
    margin-right: 0.1rem;
}
  
.signer-list .li-entp-seal{
  padding: 0.1rem 0.5rem;
  .entp-seal{
    width: 180px;
    height: 180px;
    border: 1px dashed #bbb;
  }
}
.signer-list .li-entp-seal{
  padding: 0.1rem 0;
}

.entp-seal{
  width: 170px;
  height: 170px;
  border: 1px dashed #bbb;
  background-color: #eee;
  justify-content: center;
  align-items: center;
  display: flex;
  padding: 5px;
  user-select: none;
  img{
    width: 160px;
  }
}
.person-seal{
  width: 170px;
  height: 80px;
  border: 1px dashed #bbb;
  background-color: #eee;
  justify-content: center;
  align-items: center;
  display: flex;
  padding: 5px;
  user-select: none;
  img{
    width: 160px;
  }
}
.inputArea-seal{
  width: 170px;
  height: 80px;
  border: 1px dashed #bbb;
  background-color: #eee;
  justify-content: center;
  align-items: center;
  display: flex;
  padding: 5px;
  user-select: none;
  img{
    width: 160px;
  }
}
.drag-class .unmover,.ghost .unmover{
  display: none !important;
}
.drag-class li,.ghost li{
  list-style: none !important;
}

.custom-drag{
  width: 150px;
  height: 70px;
}
</style>