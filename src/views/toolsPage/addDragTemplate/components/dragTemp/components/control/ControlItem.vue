<template>
	<div>
		<span :class="['resrun-control','resrun-control-move','this-click']"
		:style="[
      {'left': element.position.left+'px'},
      {'top': element.position.top+'px'},
      {'--primary':'#1F56B8'},
      {'--translucent':'#5589E2'},
      {'--background':'#ACC5F1'},
      {'--background-rgb':'172 197 241'},
      {'cursor':'move'}
    ]"
		@mousedown.salf="controlMovemousedown($event,element)"
		@mouseenter.stop="controlMouseover"
		@mouseleave="mouseoverMouseout">
      <!-- =====控件布局===== -->
      <!-- 发起方 -->
      <div 
        v-if="element.type === 'launch'"
        ref="input" 
        :class="['control-'+element.type,'control-item','arow-content',element.controlClick?'click':'default']" 
        @click.stop="focusInput(element)"
      >
        <!-- 单行文本 -->
        <template v-if="element.editType === 'input'">
          <div 
            class="control-launch-input"
            :style="{
              'min-width': element.size.width + 'px',
              'max-width': CanvasZoom.width + 'px',
              'height': element.size.height + 'px',
              'font-size': element.editInfo.fontSize + 'px',
              'line-height': element.size.height + 'px'
            }"
          >{{ element.editInfo.defaultValue }}</div>
        </template>
        <!-- 多行文本 -->
        <template v-if="element.editType === 'inputArea'">
          <div 
            class="control-launch-inputArea"
            :style="{
              'width': element.size.width + 'px', 
              'min-height': element.size.height + 'px',
              'font-size': element.editInfo.fontSize + 'px',
              'line-height': element.size.height + 'px'
            }"
          >{{ element.editInfo.defaultValue }}</div>
        </template>
        <!-- 数字 -->
        <template v-if="element.editType === 'number'">
          <div 
            class="control-launch-number"
            :style="{
              'width': element.size.width + 'px', 
              'height': element.size.height + 'px',
              'font-size': element.editInfo.fontSize + 'px',
              'line-height': element.size.height + 'px'
            }"
          >{{ element.editInfo.defaultValue }}</div>
        </template>
        <!-- 日期 -->
        <template v-if="element.editType === 'date'">
          <div 
            class="control-launch-date"
            :style="{
              'width': element.size.width + 'px', 
              'height': element.size.height + 'px',
              'font-size': element.editInfo.fontSize + 'px',
              'line-height': element.size.height + 'px'
            }"
          >{{ element.editInfo.defaultValue }}</div>
        </template>
        <!-- 复选框 -->
        <template v-if="element.editType === 'checkbox'">
          <el-checkbox 
            class="control-launch-checkbox"
            :style="{
              'width': element.size.width + 'px', 
              'height': element.size.height + 'px',
              'font-size': element.editInfo.fontSize + 'px',
              'line-height': element.size.height + 'px'
            }"
          ></el-checkbox>
        </template>
        <!-- 手机号 -->
        <template v-if="element.editType === 'phone'">
          <div 
            class="control-launch-phone"
            :style="{
              'width': element.size.width + 'px', 
              'height': element.size.height + 'px',
              'font-size': element.editInfo.fontSize + 'px',
              'line-height': element.size.height + 'px'
            }"
          >{{ element.editInfo.defaultValue }}</div> 
        </template>
        <!-- 身份证号 -->
        <template v-if="element.editType === 'idCard'">
          <div
            class="control-launch-idCard"
            :style="{
              'width': element.size.width + 'px', 
              'height': element.size.height + 'px',
              'font-size': element.editInfo.fontSize + 'px',
              'line-height': element.size.height + 'px'
            }"
          >{{ element.editInfo.defaultValue }}</div>
        </template>
			</div>
      <!-- 个人 -->
			<div 
        v-if="element.type === 'signature'"
        ref="input" 
        :class="['control-'+element.type,'control-item','arow-content',element.controlClick?'click':'default']"
        @click.stop="focusInput(element)"
      >
        <template v-if="element.editType === 'personal-signature'">
          <div 
            class="control-personal-signature control-personal"
            :style="{
              'width': element.size.width + 'px', 
              'height': element.size.height + 'px',
              'font-size': element.editInfo.fontSize + 'px'
            }"
          >
            <div class="desc-box">
              <i class="el-icon-edit"></i>
              <span>{{ element.editInfo.defaultValue }}</span>
            </div>
          </div> 
        </template>
        <template v-if="element.editType === 'personal-date'">
          <div 
            class="control-personal-date control-personal"
            :style="{
              'width': element.size.width + 'px', 
              'height': element.size.height + 'px',
              'font-size': element.editInfo.fontSize + 'px',
              'line-height': element.size.height + 'px'
            }"
          >
            <div class="desc-box">
              <i class="el-icon-date"></i>
              <span>{{ element.editInfo.defaultValue }}</span>
            </div>
          </div> 
        </template>
			</div>
      <!-- 公司 -->
			<div 
        v-if="['seal','outSeal'].includes(element.type)"
        ref="input" 
        :class="['control-'+element.type,'control-item','arow-content',element.controlClick?'click':'default']" 
        @click.stop="focusInput(element)"
      >
        <template v-if="element.editType === 'company-seal'">
          <div 
            class="control-company-seal control-company"
            :style="{
              'width': element.size.width + 'px', 
              'height': element.size.height + 'px',
              'font-size': element.editInfo.fontSize + 'px'
            }"
          >
            <div class="desc-box">
              <i class="el-icon-edit"></i>
              <span>{{ element.editInfo.defaultValue }}</span>
            </div>
          </div>
        </template>
        <template v-if="element.editType === 'company-date'">
          <div 
            class="control-company-date control-company"
            :style="{
              'width': element.size.width + 'px', 
              'height': element.size.height + 'px',
              'font-size': element.editInfo.fontSize + 'px',
              'line-height': element.size.height + 'px'
            }"
          >
            <div class="desc-box">
              <i class="el-icon-date"></i>
              <span>{{ element.editInfo.defaultValue }}</span>
            </div>
          </div>
        </template>
			</div>
      <!-- =====控件控制===== -->
			<div class="control-handles">
				<div class="handle handle-top-left receive-color this-click"
				v-on:mousedown.salf="controlZoomMousedown($event,element,1)"
				v-if="element.controlClick && element.zoom"
				></div>
				<div v-if="operateType !== 'check'" class="closeControl handle-top-right receive-color this-click"
					v-on:click.stop="controlDelete">
					<!-- <CloseCircleOutlined style="font-size: 18px;color: red;"/> -->
          <i class="el-icon-circle-close"></i>
				</div>
				 
				<div class="handle handle-bottom-left receive-color this-click"
				v-on:mousedown.salf="controlZoomMousedown($event,element,2)"
				v-if="element.controlClick && element.zoom"
				></div>
				<div class="handle handle-bottom-right receive-color this-click"
				v-on:mousedown.salf="controlZoomMousedown($event,element,3)"
				v-if="element.controlClick && element.zoom"
				></div> 
			</div>
		</span>
		<div class="signer-tips" v-if="element.controlClick && element.user.index != -1"
		:style="['left:'+element.position.left+'px;top:'+(element.position.top +10+ element.size.height)+'px;',
		'width:' + element.size.width + 'px']">
			{{element.user.signerName}}
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { CanvasZoom } from "./data/ControlData"
import {moveRange,currentPosition,currentPositionReverse} from "./data/ControlerMoveRange"
export default {
  name: 'control-item',
  components: {
    
  },
  props:{
    element:{
      type: Object
    },
    doc:{
      type:Object
    },
    isSign:{
      type:Boolean,
      default:false
    }
  },
  data(){
    return {
      CanvasZoom: JSON.parse(JSON.stringify(CanvasZoom)),
      cursorStyle: 'cursor:move;',
      zoomType:0,
      input: null,
      lineInput: null,
      linesInput: null,
      datePicker: null,
      dbclick: false,
      datePickerOpen: false,
      sealVisible: true,
      nowPoint:{
        x: 0,
        y:0
      },
      eventMove: {
        x:0,
        y:0
      },
      moveIn: false,
      moveTimeout: null,
      // tooltip显隐
      tooltipVisible: false,
    }
  },
  created(){
    this.initData()
  },
  computed:{
    ...mapGetters([
      'operateType'
    ])
  },
  methods:{   
    controlDelete(e){
      this.$emit('controlDelete',this.element)
      this.tooltipVisible = false
    },
    focusInput(element){
      this.$emit('focusInput',this.element)
    },
    clearSeal(){
      this.$emit('clearSeal',this.element)
    },
    controlMovemousedown(e,element,falg){
      if(this.operateType !== 'check'){
        this.nowPoint = {
          x:e.clientX,
          y:e.clientY
        }
        //offsetX:e.offsetX,
        //offsetY:e.offsetY,
        let that = this
        document.addEventListener('mousemove', that.moveControl)
        //松开鼠标清除移动函数事件
        document.addEventListener('mouseup',
          function () {
            document.removeEventListener('mousemove', that.moveControl)
            that.removeMousedown()
          },
          {
          // 只绑定一次事件
            once: true,
          }
        )
      }
    },
    moveControl(e){
      //当前鼠标位置
      var nowPos = {
        x: e.clientX,
        y: e.clientY,
      }
      //计算鼠标移动过的距离
      var dis = {
        x: nowPos.x - this.nowPoint.x,
        y: nowPos.y - this.nowPoint.y,
      }
      this.nowPoint = nowPos;
      this.element.position.left += dis.x ;
      this.element.position.top += dis.y;
    },
    removeMousedown(){
      let x = this.element.position.left + this.eventMove.x;
      let y = this.element.position.top + this.eventMove.y;
      const opt = {
        x:x,
        y:y,
        pageSize:this.element.pageSize,
        size:this.element.size,
        currentPage:0,
      };
      moveRange(opt);
      const pageLeft = currentPosition(opt.y,opt.currentPage);
      this.element.position.left = opt.x;
      this.element.position.top = opt.y;
      this.element.position.page = opt.currentPage;
    },
    controlZoomMousedown(e,element,type){
      //移动方位不一致，位置计算也不相同  通过type区分
      this.zoomType = type;
      //点击当前坐标点
      this.nowPoint = {
        x:e.clientX,
        y:e.clientY
      }
      //绑定移动事件
      document.addEventListener('mousemove', this.zoomControl(e))
      //松开鼠标清除移动函数事件  
      document.addEventListener('mouseup',
        function () {
          //还原让控件可拖动
          document.removeEventListener('mousemove', this.zoomControl(e))
        },
        {
        // 只绑定一次事件
        once: true,
        }
      )
    },
    zoomControl(e){
      e.stopPropagation();
      //移动到新的坐标点
      var nowPos = {
        x: e.clientX,
        y: e.clientY,
      }
      //计算鼠标移动过的距离
      var dis = {
        x: nowPos.x - this.nowPoint.x,
        y: nowPos.y - this.nowPoint.y,
      }
      //将旧的坐标更换成新的坐标
      this.nowPoint = nowPos;
      const nowPon = {
        width:0,
        height:0,
        left:0,
        top:0
      }
      if(this.zoomType == 3){
        //横纵坐标 直接+
        nowPon.width = this.element.size.width + dis.x;
        nowPon.height = this.element.size.height + dis.y;
        nowPon.top = this.element.position.top;
        nowPon.left = this.element.position.left;
      }
      if(this.zoomType == 2){
        nowPon.width = this.element.size.width + dis.x * -1;
        nowPon.height = this.element.size.height + dis.y;
        nowPon.left = this.element.position.left + dis.x;
        nowPon.top = this.element.position.top;
      }
      if(this.zoomType == 1){
        nowPon.width = this.element.size.width + dis.x * -1;
        nowPon.left = this.element.position.left + dis.x;
        nowPon.height = this.element.size.height + dis.y * -1;
        nowPon.top = this.element.position.top + dis.y;
      }
      if(nowPon.width < this.element.size.minWidth){
        nowPon.width = this.element.size.minWidth
        nowPon.left = this.element.position.left;
      }
      
      if(nowPon.height < this.element.size.minHeight){
        nowPon.height = this.element.size.minHeight
        nowPon.top = this.element.position.top;
      }
      if(nowPon.left<0){
        nowPon.left = 0;
      }
      if(nowPon.top<0){
        nowPon.top = 0;
      }
      
      if(nowPon.width> this.CanvasZoom.width){
        nowPon.width = this.CanvasZoom.width;
      }
      if(nowPon.height> this.CanvasZoom.height){
        nowPon.height = this.CanvasZoom.height;
      }
      this.element.size.width = nowPon.width
      this.element.size.height = nowPon.height;
      this.element.position.left = nowPon.left;
      this.element.position.top = nowPon.top;
      
    },
    controlZoomMouseover(opt){
      //emit('moveDisabled',opt);
    },
    inputMousedown(e){
    },
    formItemFocus (){
        
    },
    inputBlur(){
        
    },
    dateChange(element){
        
    },
    controlMouseover(e){
      //防止鼠标快速划过控件显示
      this.moveTimeout = setTimeout(function(){
        this.moveIn = true;
      },100)
    },
    mouseoverMouseout(e){
      if(!this.moveIn){
        clearTimeout(this.moveTimeout)
      }
      this.moveIn = false;
    },
    settingSeal(e){
      this.element.showModal = true;
    },
    initData(){
      this.element.position.top = currentPositionReverse(this.element.position.top,this.element.position.page);
      //import dayjs from 'dayjs';
      //cursor: pointer;
    },
    addSeal(seal){
      //this.element.dataId = dataId;
      this.element.data = seal;
      this.element.setting = true;
      
    },
    //如果必填   有值改变将error清除掉
    valueChange(element){
      if(element.required){
        element.error = false;
      }
    }
  }
}
</script>

<style lang="less" scoped>
	
	.resrun-control{
		user-select: none;
		cursor: move;
		position: absolute;
	}
	.resrun-control :hover{
		
	}
	.signer-tips{
		width: 100%;
		border: 1px solid #e3e3e3;
		background-color: #f8f8f8;
		position: absolute;
		top: calc(100% + 10px);
		text-align: center;
	}
	.control-required{
		position: absolute;
		height: 100%;
		left:-10px;
		top:0;
		line-height: 100%;
		display: flex;
		align-items: center;
		color:red
	}
	.control-item{
		position: relative;
	}
  // ==========拖拽之后的控件样式==========
  // 发起方控件：文本框、数字、手机号、身份证号、日期、复选框
  .control-launch-input{
    border-width: 0.511797px;
    border-color: rgb(25, 178, 119);
    background-color: rgba(25, 178, 119, 0.12);
    border-radius: 4.09437px;
    border-style: dashed;
    color: #c1c1c1;
    text-align: left;
    text-wrap: nowrap;
    overflow: hidden;
  }
  .control-launch-inputArea{
    border-width: 0.511797px;
    border-color: rgb(25, 178, 119);
    background-color: rgba(25, 178, 119, 0.12);
    border-radius: 4.09437px;
    border-style: dashed;
    color: #c1c1c1;
    text-align: left;
    word-break: break-all;
    word-wrap: break-word;
  }
  .control-launch-number{
    border-width: 0.511797px;
    border-color: rgb(25, 178, 119);
    background-color: rgba(25, 178, 119, 0.12);
    border-radius: 4.09437px;
    border-style: dashed;
    color: #c1c1c1;
    text-align: left;
    word-break: break-all;
    word-wrap: break-word;
  }
  .control-launch-date{
    border-width: 0.511797px;
    border-color: rgb(25, 178, 119);
    background-color: rgba(25, 178, 119, 0.12);
    border-radius: 4.09437px;
    border-style: dashed;
    color: #c1c1c1;
    text-align: left;
    word-break: break-all;
    word-wrap: break-word;
  }
  .control-launch-checkbox{
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 24.761px;
    height: 24.761px;
    border-width: 0px;
    border-color: rgb(25, 178, 119);
    background-color: rgba(25, 178, 119, 0.12);
    border-radius: 4.09437px;
    border-style: dashed;
  }
  .control-launch-phone{
    border-width: 0.511797px;
    border-color: rgb(25, 178, 119);
    background-color: rgba(25, 178, 119, 0.12);
    border-radius: 4.09437px;
    border-style: dashed;
    color: #c1c1c1;
    text-align: left;
    word-break: break-all;
    word-wrap: break-word;
  }
  .control-launch-idCard{
    border-width: 0.511797px;
    border-color: rgb(25, 178, 119);
    background-color: rgba(25, 178, 119, 0.12);
    border-radius: 4.09437px;
    border-style: dashed;
    color: #c1c1c1;
    text-align: left;
    word-break: break-all;
    word-wrap: break-word;
  }
  // 个人控件：个人签名、个人签署日期
  .control-personal{
    border-width: 0.511797px;
    border-color: rgb(250, 173, 21);
    background-color: rgba(250, 173, 21, 0.12);
    border-radius: 0px 0px 4.09437px 4.09437px;
    border-style: dashed;
  }
  .control-personal-signature{
    color: #c1c1c1;
    text-align: left;
    word-break: break-all;
    word-wrap: break-word;
    display: flex;
    justify-content: flex-end;
    align-items: end;
    .desc-box{
      display: flex;
      align-items: center;
      font-size: 12px;
      padding: 10px;
    }
  }
  .control-personal-date{
    color: #c1c1c1;
    text-align: left;
    word-break: break-all;
    word-wrap: break-word;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .desc-box{
      display: flex;
      align-items: center;
      font-size: 12px;
      padding: 5px 10px;
    }
  }
  // 公司控件：公司签章、公司签署日期
  .control-company{
    border-width: 0.511797px;
    border-color: rgb(47, 136, 255);
    background-color: rgba(47, 136, 255, 0.12);
    border-radius: 0px 0px 4.09437px 4.09437px;
    border-style: dashed;
  }
  .control-company-seal{
    color: #c1c1c1;
    text-align: left;
    word-break: break-all;
    word-wrap: break-word;
    display: flex;
    justify-content: flex-end;
    align-items: end;
    .desc-box{
      display: flex;
      align-items: center;
      font-size: 12px;
      padding: 5px 10px;
    }
  }
  .control-company-date{
    color: #c1c1c1;
    text-align: left;
    word-break: break-all;
    word-wrap: break-word;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .desc-box{
      display: flex;
      align-items: center;
      font-size: 12px;
      padding: 5px 10px;
    }
  }
  // ==========拖拽之后的控件样式==========
	.setting-sign{
		position: absolute;
		bottom: 0;
		width: 100%;
		text-align: center;
		line-height: 30px;
		background-color: #eee;
	}
	.control-item.default{
		width:100%;
		height: 100%;
		// border: 1px;
		// border-style: dashed;
		// border-radius: 1px;
		// border-color:var(--translucent);
		// background-color: rgb(var(--background-rgb),0.5)
	}
	.control-item.click{
		width:100%;
		height: 100%;
		// border: 1px;
		// border-radius: 2px;
		// border-style: solid;
		// border-color:var(--translucent);
		// background-color: #fff;
	}
	.control-item label{
		color: #a9a9a9;
		// padding-left: 5px;
	}
	.control-handles{
		.handle{
			width: 5px;
			height: 5px;
			background-color: var(--primary);
			position: absolute;
			z-index: 999;
		}
		.closeControl{
			width: 18px;
			height: 18px;
			position: absolute;
			font-size: 20px;
			cursor: default;
			background-color: #fff;
			display: flex;
			border-radius: 50%;
		}
		.handle-top-left{
			top:-2px;
			left: -2px;
			cursor: nw-resize;
		}
		.handle-top-right{
			top:-7px;
			right: -7px;
		}
		.handle-bottom-left{
			bottom:-2px;
			left: -2px;
			cursor: sw-resize;
		}
		.handle-bottom-right{
			bottom :-2px;
			right: -2px;
			cursor: se-resize;
		}
	}
	.control-signature{
		display: flex;
		flex-direction: column;
		text-align: center;
		align-items: center;
    justify-content: center;
		span{
			pointer-events: none;
			display: block;
		}
		span:nth-child(1){
			//line-height: 30px;
			height: 40px;
			padding-top: 5px;
		}
	}
	.control-seal{
		display: flex;
		flex-direction: column;
		text-align: center;
		justify-content: center;
		span{
			display: block;
			pointer-events: none;
		}
		span:nth-child(1){
			height: 40px;
			padding-top: 5px;
		}
		span:nth-child(2){
			line-height: 30px;
		}
	}
  .control-outSeal{
		display: flex;
		flex-direction: column;
		text-align: center;
		justify-content: center;
		span{
			display: block;
			pointer-events: none;
		}
		span:nth-child(1){
			height: 40px;
			padding-top: 5px;
		}
		span:nth-child(2){
			line-height: 30px;
		}
	}
  .control-launch{
		display: flex;
		flex-direction: column;
		text-align: center;
		justify-content: center;
		span{
			display: block;
			pointer-events: none;
		}
		span:nth-child(1){
			height: 40px;
			padding-top: 5px;
		}
		span:nth-child(2){
			line-height: 30px;
		}
	}
	.seal-modal{
		width: 200px;
		.seal-modal-title{
			font-weight: 600;
			font-size: 14px;
			line-height: 30px;
		}
		.seal-item{
			border-style: dashed;
			border-color: #e0e0e0;
			border-width: 1px;
			padding: 20px 20px 0 20px;
			margin-bottom: 20px;
			cursor: pointer;
			.seal-img{
				width: 160px;
				height: 160px;
			}
			.seal-name{
				line-height: 30px;
				text-align: center;
			}
		}
		.seal-item:hover{
			border-color:#5589E2
		}
	}
	.control-sign-date,.control-date{
		display: flex;
		flex-direction: column;
		text-align: center;
		justify-content: center;
		span{
			line-height: 30px;
			pointer-events: none;
		}
	}
  .delete-btn{
    cursor: pointer;
  }
</style>
<style>
	.seal-popover .ant-popover-message-title{
		padding-left: 0px !important;
	}
  .el-icon-circle-close{
    color: #333;
  }
</style>