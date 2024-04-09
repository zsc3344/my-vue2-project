<template>
  <div id="elesign" class="elesign">
    <el-row class="row-container">
      <el-col :span="4" style="margin-top:1%;padding: 0 10px;">
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
      </el-col>
      <el-col :span="16" class="sign-content">
        <c-scrollbar>
          <div class="document-content">
            <div class="document-list" :style="[
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
      </el-col>
      <el-col :span="4" style="margin-top:1%;padding: 0 10px;">
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
      </el-col>
    </el-row>
  </div>
</template>
<script>
import draggable from "vuedraggable"

import image1 from "./assets/images/doc_1.png"
import image2 from "./assets/images/doc_2.png"
import { CanvasZoom, controlList } from './components/control/data/ControlData'
import {moveRange,currentPosition} from './components/control/data/ControlerMoveRange'
import { controlArray } from './assets/control'
import ControlItem from './components/control/ControlItem.vue'

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
        control: []
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
      }
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
      console.log('===this.documentPDF.control===', this.documentPDF.control)
      const moveTarget = this.documentPDF.control[e.newIndex];
      if(e.pullMode){
        const opt = {
          x:e.originalEvent.offsetX - (moveTarget.size.width/2),
          y:e.originalEvent.offsetY - (moveTarget.size.height/2),
          pageSize:3,
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
      console.log('===element===', element)
      this.currentFocusElement = {...element}
    },
    /**
     * 判断控件的class  是否可进行拖动
     */
    controlClass(element){
      if(element.type == 'seal' && this.signData.signType == 1 && this.thisControlList[0].value){
        return "control-move";
      }else if(element.type == 'signature' && this.signData.signType == 1 && this.thisControlList[1].value){
        return  "control-move";
      }else if(element.type == 'inputArea' && this.signData.signType == 1){
        return  "control-move";
      }else{
        return "control-disabled";
      }
      //return  "control-move";
    },
    dragChange(event){
      console.log('===event===', event)
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
    .left-title {
      text-align:center;
      padding-bottom: 10px;
    }
    li{
      list-style-type:none;
      padding: 10px;
    }
    .imgstyle{
        vertical-align: middle;
        width: 130px;
        border: solid 1px #e8eef2;
        background-repeat:no-repeat;
    }
    .right {
        position: absolute;
        top: 7px;
        right: -177px;
        margin-top: 34px;
        padding-top: 10px;
        padding-bottom: 20px;
        width: 152px;
    }
    .right-item {
        margin-bottom: 15px;
        margin-left: 10px;
    }
    .right-item-title {
        color: #777;
        height: 20px;
        line-height: 20px;
        font-size: 12px;
        font-weight: 400;
        text-align: left !important;
    }
    .detail-item-desc {
        color: #333;
        line-height: 20px;
        width: 100%;
        font-size: 12px;
        display: inline-block;
        text-align: left;
    }
  }
  .config-area {
    display: flex;
    flex-direction: column;
    .edit-area{
      display: flex;
      flex-direction: column;
      background-color: #ffffff;
      padding: 10px;
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

.sign-content{
  flex: 1;
  height: 100%;
  min-width: 800px;
  border-left: 1px solid #e3e3e3;
  border-right: 1px solid #e3e3e3;
  background-color: #f1f1f1;
  padding: 4px 0 20px 0;
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

.custom-drag{
  width: 150px;
  height: 70px;
}
</style>