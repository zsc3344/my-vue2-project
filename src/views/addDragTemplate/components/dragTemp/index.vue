<template>
  <div id="elesign" class="elesign" v-loading="saveLoading">
    <div class="row-container">
      <!-- 左侧拖拽栏 -->
      <div class="left-box">
        <div class="widget-container">
          <el-select v-model="widgetParams.signTypeItem" value-key="signLabel" placeholder="请选择" @change="selectSignType">
            <el-option
              v-for="item in signTypes"
              :key="item.signLabel"
              :label="item.signLabel"
              :value="item">
            </el-option>
          </el-select>
          <div class="widget-box">
            <el-tabs v-if="widgetParams.signType === 1" v-model="widgetParams.activeTab" type="card" :stretch="false" @tab-click="handleTabClick">
              <el-tab-pane label="默认控件" name="default">
                <div class="signer-list">
                  <ul>
                    <draggable :list="filterDefaultControlList"  handle=".control-move" filter=".unmover"  item-key="name"
                        :force-fallback="true"  animation="300" @end="controlsDragOver"
                        :group="groupOut" :fallback-class="true" :fallback-on-body="true" :touch-start-threshold="50"
                        :fallback-tolerance="50" :clone="clone" :sort="false" drag-class="drag-class"
                        :disabled="operateType === 'check'"
                      >
                      <template v-for="element in filterDefaultControlList">
                        <div>
                          <li  :class="['li-entp-seal',controlClass(element)]">
                            <div class="entp-seal item" v-if="element.type== 'seal'">
                              <span>{{ element.name }}</span>
                            </div>
                            <div class="entp-seal item" v-if="element.type== 'outSeal'">
                              <span>{{ element.name }}</span>
                            </div>
                            <div class="person-seal item" v-if="element.type== 'signature'">
                              <span>{{ element.name }}</span>
                            </div>
                            <div class="custom-seal item" v-if="element.type == 'launch'">
                              <span>{{ element.name }}</span>
                            </div>
                          </li>
                        </div>
                      </template> 
                    </draggable>
                  </ul>
                </div>
              </el-tab-pane>
              <el-tab-pane label="自定义控件" name="custom">
                <div class="signer-list">
                  <ul>
                    <draggable :list="customControlList"  handle=".control-move" filter=".unmover"  item-key="name"
                        :force-fallback="true"  animation="300" @end="controlsDragOver"
                        :group="groupOut" :fallback-class="true" :fallback-on-body="true" :touch-start-threshold="50"
                        :fallback-tolerance="50" :clone="clone" :sort="false" drag-class="drag-class"
                        :disabled="operateType === 'check'"
                      >
                      <template v-for="element in customControlList">
                        <div>
                          <li  :class="['li-entp-seal',controlClass(element)]">
                            <div class="entp-seal item" v-if="element.type== 'seal'">
                              <span>{{ element.name }}</span>
                            </div>
                            <div class="person-seal item" v-if="element.type== 'signature'">
                              <span>{{ element.name }}</span>
                            </div>
                            <div class="custom-seal item" v-if="element.type == 'launch'">
                              <span>{{ element.name }}</span>
                            </div>
                          </li>
                        </div>
                      </template> 
                    </draggable>
                  </ul>
                </div>
              </el-tab-pane>
            </el-tabs>
            <template v-else>
              <div class="signer-list">
                <ul>
                  <draggable :list="filterDefaultControlList"  handle=".control-move" filter=".unmover"  item-key="name"
                      :force-fallback="true"  animation="300" @end="controlsDragOver"
                      :group="groupOut" :fallback-class="true" :fallback-on-body="true" :touch-start-threshold="50"
                      :fallback-tolerance="50" :clone="clone" :sort="false" drag-class="drag-class"
                      :disabled="operateType === 'check'"
                    >
                    <template v-for="element in filterDefaultControlList">
                      <div>
                        <li  :class="['li-entp-seal',controlClass(element)]">
                          <div class="entp-seal item" v-if="element.type== 'seal'">
                            <span>{{ element.name }}</span>
                          </div>
                          <div class="entp-seal item" v-if="element.type== 'outSeal'">
                            <span>{{ element.name }}</span>
                          </div>
                          <div class="person-seal item" v-if="element.type== 'signature'">
                            <span>{{ element.name }}</span>
                          </div>
                          <div class="custom-seal item" v-if="element.type == 'launch'">
                            <span>{{ element.name }}</span>
                          </div>
                        </li>
                      </div>
                    </template> 
                  </draggable>
                </ul>
              </div>
            </template>
          </div>
        </div>
      </div>
      <!-- 中间文档内容，拖拽区域 -->
      <div class="sign-content" id="sign-content" ref="sign-content">
        <c-scrollbar>
          <div class="document-content" ref="document-content">
            <div id="document-list" class="document-list" :style="[
              {'height': (CanvasZoom.height * documentPDF.images.length + documentPDF.images.length * 16) +'px'}
              ]" v-if="documentPDF && documentPDF.images">
              <template v-for="(item, index) in documentPDF.images">
                <div class="document-page group" :ref="'signPage'+index" v-if="item"
                  :style="'transform: translate(0,'+(item.docPage * CanvasZoom.height + (item.docPage+1) * 16)+'px);'">
                  <el-image style="width: 100%;" :src="item.image" :alt="contractDefaultImg" @load="loadImageSuccessFn"/>
                  <span v-if="loadImageSuccess" class="page-number">{{ index + 1 }}/{{documentPDF.images.length}}</span>
                </div>
              </template>
              <draggable :list="documentPDF.control" ghost-class="ghost" draggable=".test"
                item-key="uid"
                :group="groupEnter" :force-fallback="true" chosen-class="chosenClass" animation="300"
                :fallback-class="true" :fallback-on-body="true" :touch-start-threshold="50"
                :fallback-tolerance="50"
                :disabled="operateType === 'check'"
                style="width: 100%;height: 100%;position: relative;" id="draggable-click" @change="dragChange">
                <template v-for="item in documentPDF.control" >
                  <ControlItem :doc="item" :element="item" :isSign="false" ref="controlItem"
                    @controlDelete="controlDelete" @focusInput="focusInput"/>
                </template>
              </draggable>
            </div>
          </div>
         </c-scrollbar> 
        </div>
      <!-- 鼠标点击在拖拽之后的自定义控件上：右侧展示编辑区域 -->
      <div v-if="draggedControlOperateType === 'edit'" class="right-box" style="padding: 5px 10px;">
        <template v-if="currentFocusElement.editType">
          <span class="right-title">设置{{ currentFocusElement.title || currentFocusElement.labelName }}</span>
          <div class="edit-area">
            <el-form :model="currentFocusElement.editInfo" :disabled="operateType === 'check'" :rules="editRules" ref="editForm" label-position="top" label-width="100px" class="demo-ruleForm">
              <el-form-item v-if="['input','inputArea'].includes(currentFocusElement.editType)" label="文本框名称" prop="labelName">
                <el-input v-model="currentFocusElement.editInfo.labelName" maxlength="50" placeholder="请输入名称" onkeyup="this.value=this.value.replace(/[^\w_^\u4E00-\u9FA5]/g,'');" @input="labelNameChange"></el-input>
                <p v-if="dragedControlNameSame" class="label-name-tip"><i class="el-icon-warning"></i>相同名称的控件在填写时将会填充一样的内容</p>
              </el-form-item>
              <el-form-item v-if="['number','date','checkbox','phone','idCard'].includes(currentFocusElement.editType)" :label="currentFocusElement.name+'控件名称'" prop="labelName">
                <el-input v-model="currentFocusElement.editInfo.labelName" maxlength="20"></el-input>
              </el-form-item>
              <el-form-item prop="isMandatory">
                <el-checkbox v-model="currentFocusElement.editInfo.isMandatory" :true-label="1" :false-label="0">必填</el-checkbox>
              </el-form-item>
              <el-form-item v-if="currentFocusElement.editType === 'input'" label="文本框默认值" prop="defaultValue">
                <el-input v-model="currentFocusElement.editInfo.defaultValue" placeholder="请输入默认值" @input="defaultValueChange"></el-input>
              </el-form-item>
              <el-form-item v-if="currentFocusElement.editType === 'inputArea'" label="文本框默认值" prop="defaultValue">
                <el-input type="textarea" :autosize="{minRows:2}" resize="both" v-model="currentFocusElement.editInfo.defaultValue" placeholder="请输入默认值" @input="defaultValueChange"></el-input>
              </el-form-item>
              <el-form-item v-if="currentFocusElement.editType !== 'checkbox'" label="字体" prop="fontType">
                <el-select v-model="currentFocusElement.editInfo.fontType" placeholder="请选择">
                  <el-option
                    v-for="item in fontFamilyOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="currentFocusElement.editType !== 'checkbox'" label="字号" prop="fontSize">
                <el-select v-model="currentFocusElement.editInfo.fontSize" placeholder="请选择">
                  <el-option
                    v-for="item in fontSizeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="currentFocusElement.editType !== 'checkbox'" label="对齐">
                <span class="position-box">
                  <el-button :type="currentFocusElement.editInfo.fontPosition === 1?'info':''" size="mini" @click="setPosition(1)">
                    <el-image style="width: 14px; height: 14px" :src="leftPositionImg"></el-image>
                  </el-button>
                  <el-button :type="currentFocusElement.editInfo.fontPosition === 2?'info':''" size="mini" @click="setPosition(2)">
                    <el-image style="width: 14px; height: 14px" :src="centerPositionImg"></el-image>
                  </el-button>
                  <el-button :type="currentFocusElement.editInfo.fontPosition === 3?'info':''" size="mini" @click="setPosition(3)">
                    <el-image style="width: 14px; height: 14px" :src="rightPositionImg"></el-image>
                  </el-button>
                </span>
              </el-form-item>
              <el-form-item v-if="currentFocusElement.editType === 'date'" label="日期格式：" prop="dateFormat">
                <el-select v-model="currentFocusElement.editInfo.dateFormat" placeholder="请选择" @change="selectDateFormat">
                  <el-option
                    v-for="item in dateOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="currentFocusElement.tabType === 'custom'">
                <el-button class="update-custom-btn" plain :disabled="!currentFocusElement.editInfo.labelName" @click="updateEditForm('editForm')">更新当前控件</el-button>
              </el-form-item>
              <el-form-item>
                <el-button class="save-new-custom-btn" plain :disabled="!currentFocusElement.editInfo.labelName" @click="saveEditForm('editForm')">保存为新自定义控件</el-button>
              </el-form-item>
            </el-form>
          </div>
        </template>
      </div>
      <!-- 鼠标点击在个人、公司类型的控件上时：右侧展示预览区域 -->
      <div v-else class="right-box" id="preview-content" ref="preview-content" style="padding: 5px 10px;">
        <template>
          <div class="right-title">预览文件</div>
          <div class="preview-area">
            <template v-for="(item, index) in documentPDF.images">
              <div 
                class="preview-page" 
                :key="index" 
                :class="currentPageIndex === index?'current-preview-page':''" 
                v-if="item"
                @click="clickPreviewPage(index)"
              >
                <div class="preview-img"> 
                  <img v-if="loadImageSuccess" style="width: 100%;height: 100%;" :src="item.image" :alt="contractDefaultImg"/>
                  <img v-else style="width: 80%;height: 95%;" :src="contractDefaultImg">
                </div>
                <span class="page-number">{{ index+1 }}/{{ documentPDF.images.length }}</span>
              </div>
            </template>
          </div>
        </template>
      </div>
    </div>
    <!-- 底部操作区域 -->
    <div class="operate-box">
      <el-button class="btn-outline-dark" @click="preStep()"> 上一步</el-button>
      <el-button class="btn-outline-dark" type="primary" @click="saveTemplate()">保存模板</el-button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import draggable from "vuedraggable"
import { CanvasZoom, controlConfig, defaultControlList, customControlList, ControlType } from './components/control/data/ControlData'
import {moveRange,currentPosition} from './components/control/data/ControlerMoveRange'
import ControlItem from './components/control/ControlItem.vue'

export default {
  components: {
    draggable,
    ControlItem
  },
  data() {
    return {
      CanvasZoom: JSON.parse(JSON.stringify(CanvasZoom)),
      controlConfig: JSON.parse(JSON.stringify(controlConfig)),
      defaultControlList: JSON.parse(JSON.stringify(defaultControlList)),
      customControlList: JSON.parse(JSON.stringify(customControlList)),
      filterDefaultControlList: [],
      customControlList: [],
      // =======左侧控件区域参数=======
      signTypes:[],
      widgetParams:{
        signTypeLabel: null,
        signType: 1,
        activeTab:'default'
      },
      //========签署相关的属性=========
			signData: {
				signType:1,
				entKeyword:"",
				personalKeyword:"",
				entName:"",
				personalName:"",
				entSeal:"",
				personalSeal:"",
				companyPositionList:[],
        outCompanyPositionList:[],
				personalPositionList:[],
        launchPositionList:[]
			},
      documentPDF: {
				images:[],
        control: []
			},
      // 新建模板字段
      templateConf: {
        seq: 1,
        tenantCode: '',
        templateName: '',
        templateType: '',
        templateCode: null,
        remark: '',
        signCompanyTotal: null,
        enabled: '1',
        personSignMsgVOS: [
          {
            signLocateKey: '',
            signDateLocateKey: '',
          },
        ],
        companySignMsgVOS: [
          {
            signLocateKey: '',
            signDateLocateKey: '',
          },
        ],
        outCompanySignMsgVOS: [],
        templateFileUrl: '',
        dataTemplateFileUrl: '',
        total: 5,
        page: 1,
        templatePdfUrl: '', // pdf文件路径
        templateImgUrls: [], // 模板图片路径集合 ,String
        templateStatus: null // 是否草稿0:草稿1:完成
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
      currentPageIndex:0,
      contractDefaultImg: require('./assets/images/contractDefault.png'),
      // 右侧编辑区域
      // 拖拽到模板上的控件名称是否重复
      dragedControlNameSame: false,
      leftPositionImg: require('./assets/images/leftPosition.png'),
      centerPositionImg: require('./assets/images/centerPosition.png'),
      rightPositionImg: require('./assets/images/rightPosition.png'),
      fontFamilyOptions:[
        {
          label: '宋体',
          value: 1
        }
      ],
      fontSizeOptions:[
        {
          label:'21',
          value: 21
        },
        {
          label:'20',
          value: 20
        },
        {
          label:'19',
          value: 19
        },
        {
          label:'18',
          value: 18
        },
        {
          label:'17',
          value: 17
        },
        {
          label:'16',
          value: 16
        },
        {
          label:'15',
          value: 15
        },
        {
          label:'14',
          value: 14
        },
        {
          label:'13',
          value: 13
        },
        {
          label:'12',
          value: 12
        },
        {
          label:'11',
          value: 11
        },
        {
          label:'10',
          value: 10
        },
        {
          label:'9',
          value: 9
        },
        {
          label:'8',
          value: 8
        },
        {
          label:'7',
          value: 7
        },
        {
          label:'6',
          value: 6
        }
      ],
      dateOptions:[
        {
          label:'yyyy年mm月dd日',
          value: 1
        },
        {
          label:'yyyy-mm-dd',
          value: 2
        },
        {
          label:'yyyy/mm/dd',
          value: 3
        }
      ],
      currentFocusElement: {},
      editRules: {
        labelName: [
          { required: true, message: '请输入名称', trigger: ['blur','change'] },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ]
      },
      // 签署页面滚动设置
      signScrollHeight: 0,
      signScrollTop:0,
      // 控件允许预览、编辑：preview/edit
      draggedControlOperateType: 'preview',
      // 预览区域滚动设置
      previewScrollHeight: 0,
      previewScrollTop: 0,
      oldSignScrollTop: 0,
      oldPreviewScrollTop: 0,
      loadImageSuccess: false,
      // 第一步数据
      stepInfo: {},
      // 模板状态
      templateStatus: null, // 0:草稿，1：完成
      // 保存加载状态
      saveLoading: false,
      // 发起方校验完毕
      launchValidPassed: false,
      // 员工校验完毕
      personValidPassed: false,
      // 甲方公司校验完毕
      companyValidPassed: false,
      // 外部公司校验完毕
      outCompanyValidPassed: false,
      // 草稿:发起方控件校验状态
      launchDraftValidStatus: true
    }
  },
  watch:{
    // 监听签署文件滚动和结束
    signScrollTop:{
      handler(newVal, oldVal){
        const signDom = document.getElementsByClassName('c-scrollbar-wrap')[0]
        const previewDom = this.$refs['preview-content']
        setTimeout(() => {
          if(newVal == signDom.scrollTop) { //延时执行后当newValue等于window.scrollY，代表滚动结束
            // console.log('滚动结束');
            this.oldSignScrollTop = newVal //每次滚动结束后都要给oldScrollTop赋值
            // 预览文件页面添加滚动事件
            previewDom.addEventListener('scroll', this.handlePreviewScroll, true)
          }
        }, 20) //必须使用延时器，否则每次newValue和window.scrollY都相等，无法判断，20ms刚好大于watch的侦听周期，故延时20ms
        if(this.oldSignScrollTop == oldVal) { //每次滚动开始时oldScrollTop与oldValue相等
          console.log('滚动开始')
        }
      }
    },
    // 监听预览文件滚动和结束
    previewScrollTop:{
      handler(newVal, oldVal){
        const signDom = document.getElementsByClassName('c-scrollbar-wrap')[0]
        const previewDom = this.$refs['preview-content']
        setTimeout(() => {
          if(newVal == previewDom.scrollTop) { //延时执行后当newValue等于window.scrollY，代表滚动结束
            // console.log('滚动结束');
            this.oldPreviewScrollTop = newVal //每次滚动结束后都要给oldScrollTop赋值
            // 签署文件页面添加滚动事件
            signDom.addEventListener('scroll', this.handleSignScroll, true)
          }
        }, 20) //必须使用延时器，否则每次newValue和window.scrollY都相等，无法判断，20ms刚好大于watch的侦听周期，故延时20ms
        if(this.oldPreviewScrollTop == oldVal) { //每次滚动开始时oldScrollTop与oldValue相等
          // console.log('滚动开始')
        }
      }
    },
    // 监听字号大小变化改变宽高
    'currentFocusElement.editInfo.fontSize':{
      handler(newVal){
        if(this.currentFocusElement.editType === 'input'){
          let percent = newVal / 12
          // this.currentFocusElement.size.width = this.controlConfig['input'].width * percent
          this.currentFocusElement.size.height = this.controlConfig['input'].height * percent
        }
        if(this.currentFocusElement.editType === 'number'){
          let percent = newVal / 12
          this.currentFocusElement.size.width = this.controlConfig['number'].width * percent
          this.currentFocusElement.size.height = this.controlConfig['number'].height * percent
        }
        if(this.currentFocusElement.editType === 'date'){
          if(this.currentFocusElement.editInfo.dateFormat) {
            let percent = newVal / 12
            this.currentFocusElement.size.width = this.controlConfig['date'][this.currentFocusElement.editInfo.dateFormat].width * percent
            this.currentFocusElement.size.height = this.controlConfig['date'][this.currentFocusElement.editInfo.dateFormat].height * percent
          }else{
            let percent = newVal / 12
            this.currentFocusElement.size.width = this.controlConfig['date'][this.currentFocusElement.editInfo.dateFormat].width * percent
            this.currentFocusElement.size.height = this.controlConfig['date'][this.currentFocusElement.editInfo.dateFormat].height * percent
          }
        }
        if(this.currentFocusElement.editType === 'phone'){
          let percent = newVal / 12  
          this.currentFocusElement.size.width = this.controlConfig['phone'].width * percent
          this.currentFocusElement.size.height = this.controlConfig['phone'].height * percent
        }
        if(this.currentFocusElement.editType === 'idCard'){
          let percent = newVal / 12
          this.currentFocusElement.size.width = this.controlConfig['idCard'].width * percent
          this.currentFocusElement.size.height = this.controlConfig['idCard'].height * percent
        }
      }
    },
    // 监听日期格式变化改变宽度 
    'currentFocusElement.editInfo.dateFormat': {
      handler(newVal){
        if(this.currentFocusElement.editType === 'date'){
          if(this.currentFocusElement.editInfo.dateFormat) {
            console.log('===this.currentFocusElement.editInfo.dateFormat===', this.currentFocusElement.editInfo.dateFormat)
            let percent = this.currentFocusElement.size.width / this.controlConfig['date'][this.currentFocusElement.editInfo.dateFormat].width
            this.currentFocusElement.size.width = this.controlConfig['date'][this.currentFocusElement.editInfo.dateFormat].width * percent
          }else{
            let percent = this.currentFocusElement.size.width / this.controlConfig['date'][1].width
            this.currentFocusElement.size.width = this.controlConfig['date'][this.currentFocusElement.editInfo.dateFormat].width * percent
          }
        }
      }
    },
    // 监听控件是编辑还是预览状态
    'draggedControlOperateType':{
      handler(newVal){
        if(newVal === 'preview') {
          this.dragedControlNameSame = false
        }
      }
    }
  },
  computed:{
    ...mapGetters(['tenantCode', 'operateType', 'dragStepInfoForTempConfig','dragDocumentPDFForTempConfig'])
  },
  created(){
    // 获取缓存的第一步、第二步配置数据
    this.getCachedConfigInfo()
    this.defaultControlList = JSON.parse(JSON.stringify(defaultControlList))
    this.filterDefaultControlList = this.defaultControlList.filter(item => {
      return item.type === 'launch'
    })
    this.setImageUrlsToPdfImages()
    this.getSignTypes()
    if (this.$route.query && this.$route.query.templateCode) {
      this.templateConf.templateCode = this.$route.query.templateCode
    }
  },
  mounted(){
    const signDom = document.getElementsByClassName('c-scrollbar-wrap')[0]
    const previewDom = this.$refs['preview-content']
    this.signScrollHeight = signDom.scrollHeight
    this.previewScrollHeight = previewDom.scrollHeight
    // 签署文件页面添加滚动事件
    signDom.addEventListener('scroll', this.handleSignScroll, true)
    // 预览文件页面添加滚动事件
    previewDom.addEventListener('scroll', this.handlePreviewScroll, true)
    // 监听draggable组件的点击事件，同时在拖拽的组件点击事件上加了stop修饰符阻止拖拽之后的控件点击事件往上冒泡：@click.stop="focusInput(element)"
    document.getElementById('draggable-click').addEventListener('click',()=>{
      this.draggedControlOperateType = 'preview'
    })
  },
  methods: {
    handleTabClick(){
      if(this.widgetParams.activeTab === 'custom'){
        this.getCustomControlList()
      }
    },
    // 获取自定义控件数据
    getCustomControlList(){
      this.parseCustomList(this.customControlList)
    },
    parseCustomList(list){
      this.customControlList = []
      for(let m = 0; m < list.length; m++){
        let item = list[m]
        for(let i = 0; i< this.defaultControlList.length; i++){
          const controlItem = this.defaultControlList[i]
          if(controlItem.labelType === item.labelType){
            item.name = item.labelName
            item.zoom = controlItem.zoom
            item.move = controlItem.move
            item.position = controlItem.position
            item.user = controlItem.user
            item.type = 'launch'
            item.signType = 'launch'
            item.editType = controlItem.editType
            item.tabType = 'custom'
            item.isCustomizeLabel = 1
            item.size = {
              width: controlItem.size.width,
              height: controlItem.size.height,
              minWidth: controlItem.size.minWidth,
              minHeight: controlItem.size.minHeight
            }
            item.editInfo = {
              "labelName": item.labelName?item.labelName:'',
              "labelRemark": item.labelRemark?item.labelRemark:'',
              "isMandatory": item.isMandatory?item.isMandatory:null,
              "defaultValue": item.defaultValue?item.defaultValue:item.labelName,
              "fontType": item.fontType?Number(item.fontType):1,
              "fontSize": item.fontSize?item.fontSize:13,
              "dateFormat": item.dateFormat?item.dateFormat:'',
              "fontPosition": item.fontPosition?Number(item.fontPosition):1
            }
            this.customControlList.push(item)
            break
          }
        }
      }
    },
    // 获取缓存的第一步、第二步配置数据
    getCachedConfigInfo(){
      // 第一步配置数据
      if(this.dragStepInfoForTempConfig && JSON.stringify(this.dragStepInfoForTempConfig) !== '{}'){
        this.stepInfo = this.dragStepInfoForTempConfig
      }
      // 第二步拖拽数据
      if(this.dragDocumentPDFForTempConfig && JSON.stringify(this.dragDocumentPDFForTempConfig) !== '{}'){
        this.documentPDF = this.dragDocumentPDFForTempConfig
      }
    },
    getSignTypes(){
      this.signTypes = []
      if(this.stepInfo && this.stepInfo.postData){
        // 发起方
        if(this.stepInfo.postData.labels && this.stepInfo.postData.labels.length > 0){
          this.stepInfo.postData.labels.forEach((newItem, index) => {
            newItem.signLabel = newItem.signName
            newItem.value = 1
            this.signTypes.push(newItem)
            if(index === 0){
              this.widgetParams.signType = 1
              this.widgetParams.signTypeItem = newItem
            }
          })
        }
        // 个人签署方
        if(this.stepInfo.postData.personSignMsg && this.stepInfo.postData.personSignMsg.length > 0){
          this.stepInfo.postData.personSignMsg.forEach((newItem) => {
            newItem.signLabel = newItem.signName
            newItem.value = 2
            this.signTypes.push(newItem)
          })
        }
        // 公司签署方
        if(this.stepInfo.postData.companySignMsg && this.stepInfo.postData.companySignMsg.length > 0){
          this.stepInfo.postData.companySignMsg.forEach((newItem) => {
            newItem.signLabel = newItem.signName
            newItem.value = 3
            this.signTypes.push(newItem)
          })
        }
        // 外部公司签署方
        if(this.stepInfo.postData.outCompanySignMsg && this.stepInfo.postData.outCompanySignMsg.length > 0){
          this.stepInfo.postData.outCompanySignMsg.forEach((newItem) => {
            newItem.signLabel = newItem.signName
            newItem.value = 4
            this.signTypes.push(newItem)
          })
        }
      }
    },
    // 上传的签署文件图片设置为预览的图片
    setImageUrlsToPdfImages(){
      this.documentPDF.images = []
      if(this.stepInfo && this.stepInfo.dragImageUrls && this.stepInfo.dragImageUrls.length){
        this.stepInfo.dragImageUrls.forEach((item, index) => {
          // docPage:0,
					// image:image1,
          let data = {
            docPage: index,
            image: item
          }
          this.documentPDF.images.push(data)
        })
      }
    },
    // 签署文件图片加载完成
    loadImageSuccessFn(){
      this.loadImageSuccess = true
    },
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
          pageSize:this.documentPDF.images.length,
          size:moveTarget.size,
          currentPage:0,
        };
        moveRange(opt);
        this.documentPDF.control[e.newIndex].signTypeItem = this.widgetParams.signTypeItem
        this.documentPDF.control[e.newIndex].position.left = opt.x
        this.documentPDF.control[e.newIndex].position.top = opt.y
        this.documentPDF.control[e.newIndex].position.page = opt.currentPage;
        this.documentPDF.control[e.newIndex].controlClick = true;
        this.$store.commit('SET_DOCUMENT_PDF_FOR_TEMP_CONFIG', this.documentPDF)
      }
    },
    //删除已拖动至文档中的控件
    controlDelete(element){
      this.documentPDF.control = this.documentPDF.control.filter((item) => {
        return item.uid !== element.uid 
      })
    },
    clickFileImage(){
      this.draggedControlOperateType = 'preview'
    },
    // 鼠标点击在文档中的控件上
    focusInput(element){
      if(element.type === 'launch'){
        // 发起方控件时，展示编辑
        this.draggedControlOperateType = 'edit'
      }else{
        // 个人和公司类型的控件时，展示预览
        this.draggedControlOperateType = 'preview'
      }
      this.currentFocusElement = {...element}
      this.filterSaveLabelNameControl()
    },
    labelNameChange(){
      this.filterSaveLabelNameControl()
    },
    defaultValueChange(){
      this.documentPDF.control = this.documentPDF.control.map((item) => {
        if(this.currentFocusElement.editInfo.labelName){
          if(item.editInfo.labelName === this.currentFocusElement.editInfo.labelName && item.uid !== this.currentFocusElement.uid) {
            item.editInfo.defaultValue = this.currentFocusElement.editInfo.defaultValue
            return item
          }else{
            return item
          }
        }else{
          return item
        }
      })
    },
    // 判断拖拽的控件是否控件名称重复
    filterSaveLabelNameControl(){
      let sameItemArr = []
      if(this.currentFocusElement && this.currentFocusElement.editInfo){
        this.documentPDF.control.forEach((item) => {
          if(this.currentFocusElement.editInfo.labelName && item.editInfo.labelName === this.currentFocusElement.editInfo.labelName){
            sameItemArr.push(item)
          }
        })
        if(sameItemArr.length > 1){
          this.dragedControlNameSame = true
        }else{
          this.dragedControlNameSame = false
        }
      }
    },
    /**
     * 判断控件的class  是否可进行拖动
     */
    controlClass(element){
      // if(element.type == 'seal' && this.signData.signType == 1 && this.defaultControlList[0]){
      //   return "control-move";
      // }else if(element.type == 'signature' && this.signData.signType == 1 && this.defaultControlList[1]){
      //   return  "control-move";
      // }else if(element.type == 'launch' && this.signData.signType == 1){
      //   if(this.defaultControlList[1]){

      //   }
      //   return  "control-move";
      // }else{
      //   return "control-disabled";
      // }
      return  "control-move";
    },
    /**
     * 签署类型切换
     */
    signTypeChange(val){
      if(this.signData.signType == 2){
        this.documentPDF.control = [];
      }
    },
    selectDateFormat(){
      this.dateOptions.forEach(item => {
        if(item.value == this.currentFocusElement.editInfo.dateFormat){
          this.currentFocusElement.editInfo.defaultValue = item.label
        }
      })
    },
    // ==================================保存草稿=====================================
    // 保存草稿的方法
    saveTemplateForDraft(params){
      if(params.saveType === 'draft'){
        this.templateStatus = 0
      }else{
        this.templateStatus = 1
      }
      this.signDocumentForDraft().then(() => {
        this.submit()
      })
    },
    signDocumentForDraft(){
      return new Promise((resolve, reject) => {
        this.signData.launchPositionList = []
        this.signData.companyPositionList = [];
        this.signData.personalPositionList = [];
        const emptyLabelNameArr = this.documentPDF.control.filter((item) => {
          return item.editInfo.labelName === '' 
        })
        if(emptyLabelNameArr.length === 0){
          //将签名控件的位置转换为签署所需的坐标
          this.documentPDF.control.forEach(item=>{
            const temItem = {
              // 签署方信息
              signTypeItem: item.signTypeItem,
              // 控件类型
              type: item.type,
              signType: item.signType,
              labelType: item.labelType,
              editType: item.editType,
              labelName: item.editInfo.labelName,
              isMandatory: item.editInfo.isMandatory,
              defaultValue: item.editInfo.defaultValue,
              fontType: item.editInfo.fontType,
              fontSize: item.editInfo.fontSize,
              dateFormat: item.editInfo.dateFormat,
              fontPosition: item.editInfo.fontPosition,
              // 控件位置
              width: item.size.width,
              height:item.size.height,
              offsetX: item.position.left,
              offsetY: currentPosition(item.position.top,item.position.page),
              // 控件所处的文件页码
              page: item.position.page,
              pageHeight: this.CanvasZoom.height,
              pageWidth: this.CanvasZoom.width,
            };
            if(item.type == ControlType.Launch){
              this.signData.launchPositionList.push(temItem)
            }else if(item.type == ControlType.Seal){
              this.signData.companyPositionList.push(temItem)
            }else if(item.type == ControlType.outSeal){
              this.signData.outCompanyPositionList.push(temItem)
            }else if(item.type == ControlType.Signature){
              this.signData.personalPositionList.push(temItem)
            }
          })
          // 组装模板创建和控件拖拽参数
          this.combineParamsForDraft().then(() => {
            resolve()
          })
        }else{
          const nameArr = emptyLabelNameArr.map(item => {
            return item.name
          })
          const arr = Array.from(new Set(nameArr))
          this.$message.error(arr.join(',') + '控件名称不能为空')
          reject()
        }
      })
    },
    // 保存草稿时：参数设置
    combineParamsForDraft(){
      return new Promise((resolve, reject) => {
        const pageWidth = document.getElementsByClassName('document-page')[0].clientWidth
        const pageHeight = document.getElementsByClassName('document-page')[0].clientHeight
        this.$store.commit('SET_PAGE_WIDTH', pageWidth)
        this.$store.commit('SET_PAGE_HEIGHT', pageHeight)
        // 合同签署信息
        if(this.stepInfo && this.stepInfo.postData){
          // 发起方控件拖拽信息
          if(this.stepInfo.postData.labels && this.stepInfo.postData.labels.length > 0){
            this.combineLaunchParamsForDraft(pageWidth, pageHeight).then(resultLabelList => {
              this.stepInfo.postData.labels = resultLabelList
              this.launchDraftValidStatus = true
            }).catch(() => {
              this.stepInfo.postData.labels = null
              this.launchDraftValidStatus = false
            })
          }else{
            this.launchDraftValidStatus = true
          }
          // 个人控件拖拽信息
          if(this.stepInfo.postData.personSignMsg && this.stepInfo.postData.personSignMsg.length > 0){
            if(this.signData.personalPositionList && this.signData.personalPositionList.length >0) {
              this.stepInfo.postData.personSignMsg = this.stepInfo.postData.personSignMsg.map((item, index) => {
                const signLocateCoordinates = []
                const signDateLocateCoordinates = []
                this.signData.personalPositionList.forEach(personPosition => {
                  if(personPosition.signTypeItem.signName == item.signName){
                    // x、y为计算之后的拖拽的控件的中心点
                    const x = personPosition.offsetX + personPosition.width / 2
                    const y = personPosition.offsetY + personPosition.height / 2
                    if(personPosition.editType == 'personal-signature') {
                      signLocateCoordinates.push({
                        x: x,
                        y: y,
                        pageWidth: pageWidth,
                        pageHeight: pageHeight,
                        xRate: x / pageWidth,
                        yRate: y / pageHeight,
                        pageNum: personPosition.page
                      })
                    }else if(personPosition.editType == 'personal-date') {
                      signDateLocateCoordinates.push({
                        x: x,
                        y: y,
                        pageWidth: pageWidth,
                        pageHeight: pageHeight,
                        xRate: x / pageWidth,
                        yRate: y / pageHeight,
                        pageNum: personPosition.page
                      })
                    }
                  }
                })
                return {
                  ...item,
                  name: item.signName,
                  signLocateMode: 2,
                  signDateLocateMode: 2,
                  signLocateCoordinates,
                  signDateLocateCoordinates
                }
              })
            }
          }
          // 公司控件拖拽信息
          if(this.stepInfo.postData.companySignMsg && this.stepInfo.postData.companySignMsg.length > 0){
            if(this.signData.companyPositionList && this.signData.companyPositionList.length >0) {
              this.stepInfo.postData.companySignMsg = this.stepInfo.postData.companySignMsg.map((item, index) => {
                const signLocateCoordinates = []
                const signDateLocateCoordinates = []
                this.signData.companyPositionList.forEach(companyPosition => {
                  if(companyPosition.signTypeItem.signName == item.signName){
                    // x、y为计算之后的拖拽的控件的中心点
                    const x = companyPosition.offsetX + companyPosition.width / 2
                    const y = companyPosition.offsetY + companyPosition.height / 2
                    if(companyPosition.editType == 'company-seal') {
                      signLocateCoordinates.push({
                        x: x,
                        y: y,
                        pageWidth: pageWidth,
                        pageHeight: pageHeight,
                        xRate: x / pageWidth,
                        yRate: y / pageHeight,
                        pageNum: companyPosition.page 
                      })
                    }else if(companyPosition.editType == 'company-date') {
                      signDateLocateCoordinates.push({
                        x: x,
                        y: y,
                        pageWidth: pageWidth,
                        pageHeight: pageHeight,
                        xRate: x / pageWidth,
                        yRate: y / pageHeight,
                        pageNum: companyPosition.page
                      })
                    }
                  }
                })
                return {
                  ...item,
                  companyName: item.signName,
                  signLocateMode: 2,
                  signDateLocateMode: 2,
                  signLocateCoordinates,
                  signDateLocateCoordinates
                }
              })
            }
          }
          // 外部公司控件拖拽信息
          if(this.stepInfo.postData.outCompanySignMsg && this.stepInfo.postData.outCompanySignMsg.length > 0){
            if(this.signData.outCompanyPositionList && this.signData.outCompanyPositionList.length >0) {
              this.stepInfo.postData.outCompanySignMsg = this.stepInfo.postData.outCompanySignMsg.map((item, index) => {
                const signLocateCoordinates = []
                const signDateLocateCoordinates = []
                this.signData.outCompanyPositionList.forEach(companyPosition => {
                  if(companyPosition.signTypeItem.signName == item.signName){
                    // x、y为计算之后的拖拽的控件的中心点
                    const x = companyPosition.offsetX + companyPosition.width / 2
                    const y = companyPosition.offsetY + companyPosition.height / 2
                    if(companyPosition.editType == 'company-seal') {
                      signLocateCoordinates.push({
                        x: x,
                        y: y,
                        pageWidth: pageWidth,
                        pageHeight: pageHeight,
                        xRate: x / pageWidth,
                        yRate: y / pageHeight,
                        pageNum: companyPosition.page 
                      })
                    }else if(companyPosition.editType == 'company-date') {
                      signDateLocateCoordinates.push({
                        x: x,
                        y: y,
                        pageWidth: pageWidth,
                        pageHeight: pageHeight,
                        xRate: x / pageWidth,
                        yRate: y / pageHeight,
                        pageNum: companyPosition.page
                      })
                    }
                  }
                })
                return {
                  ...item,
                  companyName: item.signName,
                  signLocateMode: 2,
                  signDateLocateMode: 2,
                  signLocateCoordinates,
                  signDateLocateCoordinates
                }
              })
            }
          }
        }
        if(this.launchDraftValidStatus){
          resolve()
        }else{
          reject()
        }
      })
    },
    // 保存草稿：组装发起方控件数据
    combineLaunchParamsForDraft(pageWidth, pageHeight){
      return new Promise((resolve, reject) => {
        let resultLabelList = []
        console.log('===this.signData.launchPositionList===',this.signData.launchPositionList)
        if(this.signData.launchPositionList && this.signData.launchPositionList.length >0) {
          const labelItem = this.stepInfo.postData.labels[0]
          // 拆分数组，将相同名称的控件合并为一个数组
          const mergedArray = this.splitPositionListForDraft(this.signData.launchPositionList)
          mergedArray.forEach(mergedItem => {
            // 拖拽的控件存在相同名称的控件，需要将position存成一个list
            if(mergedItem && mergedItem.length > 1) {
              const launchPosition = mergedItem[0]
              let labelConfig = {}
              let labelPosition = []
              let resultItemArr = []
              if(launchPosition.labelName){
                if(launchPosition.signTypeItem.signName == labelItem.signName){
                  // 获取控件信息
                  labelConfig = launchPosition
                  if(!labelConfig.defaultValue){
                    labelConfig.defaultValue = launchPosition.labelName
                  }
                }
              }
              for(let i = 0; i < mergedItem.length; i++){
                let launchPosition = mergedItem[i]
                if(launchPosition.labelName){
                  if(launchPosition.signTypeItem.signName == labelItem.signName){
                    // x、y为计算之后的拖拽的控件的中心点
                    // const x = launchPosition.offsetX + launchPosition.width / 2
                    // const y = launchPosition.offsetY + launchPosition.height / 2
                    // x、y为计算之后的拖拽的控件的左下坐标点
                    const x = launchPosition.offsetX
                    const y = launchPosition.offsetY + launchPosition.height * 2/3
                    labelPosition.push({
                      x: x,
                      y: y,
                      pageWidth: pageWidth,
                      pageHeight: pageHeight,
                      xRate: x / pageWidth,
                      yRate: y / pageHeight,
                      pageNum: launchPosition.page
                    })
                  }
                }else{
                  this.$message.warning(`请设置${launchPosition.defaultValue}控件名称`)
                  return
                }
              }
              resultItemArr = [{
                ...labelItem,
                label: launchPosition.labelName,
                labelName: labelConfig.labelName,
                isCustomizeLabel: launchPosition.isCustomizeLabel?launchPosition.isCustomizeLabel:null,
                labelConfig,
                labelPosition
              }]
              resultLabelList = resultLabelList.concat(resultItemArr)
            }else{
              let launchPosition = mergedItem[0]
              if(launchPosition.labelName){
                let labelConfig = {}
                let labelPosition = []
                if(launchPosition.signTypeItem.signName == labelItem.signName){
                  // 获取控件信息
                  labelConfig = launchPosition
                  if(!labelConfig.defaultValue){
                    labelConfig.defaultValue = launchPosition.labelName
                  }
                  // x、y为计算之后的拖拽的控件的中心点
                  // const x = launchPosition.offsetX + launchPosition.width / 2
                  // const y = launchPosition.offsetY + launchPosition.height / 2
                  // x、y为计算之后的拖拽的控件的左下坐标点
                  const x = launchPosition.offsetX
                  const y = launchPosition.offsetY + launchPosition.height * 2/3
                  labelPosition.push({
                    x: x,
                    y: y,
                    pageWidth: pageWidth,
                    pageHeight: pageHeight,
                    xRate: x / pageWidth,
                    yRate: y / pageHeight,
                    pageNum: launchPosition.page
                  })
                }
                let resultItemArr = [{
                  ...labelItem,
                  label: launchPosition.labelName,
                  labelName: labelConfig.labelName,
                  isCustomizeLabel: launchPosition.isCustomizeLabel?launchPosition.isCustomizeLabel:null,
                  labelConfig,
                  labelPosition
                }]
                resultLabelList = resultLabelList.concat(resultItemArr)
              }else{
                this.$message.warning('请设置控件名称')
                reject()
              }
            }
          })
          resolve(resultLabelList)
        }else{
          reject()
        }
      })
    },
    // 保存草稿：拆分数组，将相同名称的控件合并为一个数组
    splitPositionListForDraft(positionList){
      let mergedArray = []
      positionList.forEach(item => {
        let index = mergedArray.findIndex(mergedItem => mergedItem[0].labelName === item.labelName)
        if(index !== -1){
          mergedArray[index].push(item)
        }else{
          mergedArray.push([item])
        }
      })
      return mergedArray
    },
    // ==================================保存模板=====================================
    async saveTemplate(){
      this.templateStatus = 1
      await this.signDocument()
      this.submit()
    },
    /**
     * 调用模板保存接口，保存模板
     */
		signDocument(){
      return new Promise((resolve, reject) => {
        this.signData.launchPositionList = []
        this.signData.companyPositionList = [];
        this.signData.personalPositionList = [];
        const emptyLabelNameArr = this.documentPDF.control.filter((item) => {
          return item.editInfo.labelName === '' 
        })
        if(emptyLabelNameArr.length === 0){
          //将签名控件的位置转换为签署所需的坐标
          this.documentPDF.control.forEach(item=>{
            const temItem = {
              // 签署方信息
              signTypeItem: item.signTypeItem,
              // 控件类型
              type: item.type,
              signType: item.signType,
              labelType: item.labelType,
              editType: item.editType,
              labelName: item.editInfo.labelName,
              isMandatory: item.editInfo.isMandatory,
              defaultValue: item.editInfo.defaultValue,
              fontType: item.editInfo.fontType,
              fontSize: item.editInfo.fontSize,
              dateFormat: item.editInfo.dateFormat,
              fontPosition: item.editInfo.fontPosition,
              // 控件位置
              width: item.size.width,
              height:item.size.height,
              offsetX: item.position.left,
              offsetY: currentPosition(item.position.top,item.position.page),
              // 控件所处的文件页码
              page: item.position.page,
              pageHeight: this.CanvasZoom.height,
              pageWidth: this.CanvasZoom.width,
            };
            if(item.type == ControlType.Launch){
              this.signData.launchPositionList.push(temItem)
            }else if(item.type == ControlType.Seal){
              this.signData.companyPositionList.push(temItem)
            }else if(item.type == ControlType.outSeal){
              this.signData.outCompanyPositionList.push(temItem)
            }else if(item.type == ControlType.Signature){
              this.signData.personalPositionList.push(temItem)
            }
          })
          // 组装模板创建和控件拖拽参数
          this.combineParams().then(() => {
            resolve()
          })
        }else{
          const nameArr = emptyLabelNameArr.map(item => {
            return item.name
          })
          const arr = Array.from(new Set(nameArr))
          this.$message.error(arr.join(',') + '控件名称不能为空')
          reject()
        }
      })
    },
    // 重新解析组装模板创建的最终参数：包含签署信息以及签署位置
    combineParams(){
      return new Promise((resolve, reject) => {
        const pageWidth = document.getElementsByClassName('document-page')[0].clientWidth
        const pageHeight = document.getElementsByClassName('document-page')[0].clientHeight
        this.$store.commit('SET_PAGE_WIDTH', pageWidth)
        this.$store.commit('SET_PAGE_HEIGHT', pageHeight)
        console.log('===pageWidth,pageHeight===', pageWidth,pageHeight)
        // 合同签署信息
        if(this.stepInfo && this.stepInfo.postData){
          // 发起方控件拖拽信息
          if(this.stepInfo.postData.labels && this.stepInfo.postData.labels.length > 0){
            this.combineLaunchParams(pageWidth, pageHeight).then(resultLabelList => {
              this.stepInfo.postData.labels = resultLabelList
              this.launchValidPassed = true
            })
          }
          // 个人控件拖拽信息
          if(this.stepInfo.postData.personSignMsg && this.stepInfo.postData.personSignMsg.length > 0){
            if(this.signData.personalPositionList && this.signData.personalPositionList.length >0) {
              this.stepInfo.postData.personSignMsg = this.stepInfo.postData.personSignMsg.map((item, index) => {
                const signLocateCoordinates = []
                const signDateLocateCoordinates = []
                this.signData.personalPositionList.forEach(personPosition => {
                  if(personPosition.signTypeItem.signName == item.signName){
                    // x、y为计算之后的拖拽的控件的中心点
                    const x = personPosition.offsetX + personPosition.width / 2
                    const y = personPosition.offsetY + personPosition.height / 2
                    if(personPosition.editType == 'personal-signature') {
                      signLocateCoordinates.push({
                        x: x,
                        y: y,
                        pageWidth: pageWidth,
                        pageHeight: pageHeight,
                        xRate: x / pageWidth,
                        yRate: y / pageHeight,
                        pageNum: personPosition.page
                      })
                    }else if(personPosition.editType == 'personal-date') {
                      signDateLocateCoordinates.push({
                        x: x,
                        y: y,
                        pageWidth: pageWidth,
                        pageHeight: pageHeight,
                        xRate: x / pageWidth,
                        yRate: y / pageHeight,
                        pageNum: personPosition.page
                      })
                    }
                  }
                })
                return {
                  ...item,
                  name: item.signName,
                  signLocateMode: 2,
                  signDateLocateMode: 2,
                  signLocateCoordinates,
                  signDateLocateCoordinates
                }
              })
              this.personValidPassed = true
            } else {
              this.$message.warning('个人签名/个人签署日期控件位置未配置！')
              return
            }
          }else{
            this.$message.warning('个人签名/个人签署日期控件位置未配置！')
            return
          }
          // 公司控件拖拽信息
          if(this.stepInfo.postData.companySignMsg && this.stepInfo.postData.companySignMsg.length > 0){
            if(this.signData.companyPositionList && this.signData.companyPositionList.length >0) {
              this.stepInfo.postData.companySignMsg = this.stepInfo.postData.companySignMsg.map((item, index) => {
                const signLocateCoordinates = []
                const signDateLocateCoordinates = []
                this.signData.companyPositionList.forEach(companyPosition => {
                  if(companyPosition.signTypeItem.signName == item.signName){
                    // x、y为计算之后的拖拽的控件的中心点
                    const x = companyPosition.offsetX + companyPosition.width / 2
                    const y = companyPosition.offsetY + companyPosition.height / 2
                    if(companyPosition.editType == 'company-seal') {
                      signLocateCoordinates.push({
                        x: x,
                        y: y,
                        pageWidth: pageWidth,
                        pageHeight: pageHeight,
                        xRate: x / pageWidth,
                        yRate: y / pageHeight,
                        pageNum: companyPosition.page 
                      })
                    }else if(companyPosition.editType == 'company-date') {
                      signDateLocateCoordinates.push({
                        x: x,
                        y: y,
                        pageWidth: pageWidth,
                        pageHeight: pageHeight,
                        xRate: x / pageWidth,
                        yRate: y / pageHeight,
                        pageNum: companyPosition.page
                      })
                    }
                  }
                })
                return {
                  ...item,
                  companyName: item.signName,
                  signLocateMode: 2,
                  signDateLocateMode: 2,
                  signLocateCoordinates,
                  signDateLocateCoordinates
                }
              })
              this.companyValidPassed = true
            } else {
              this.$message.warning('公司签章/公司签署日期位置未配置！')
              return
            }
          }else{
            this.$message.warning('公司签章/公司签署日期位置未配置！')
            return
          }
          // 外部公司控件拖拽信息
          if(this.stepInfo.postData.outCompanySignMsg && this.stepInfo.postData.outCompanySignMsg.length > 0){
            if(this.signData.outCompanyPositionList && this.signData.outCompanyPositionList.length >0) {
              this.stepInfo.postData.outCompanySignMsg = this.stepInfo.postData.outCompanySignMsg.map((item, index) => {
                const signLocateCoordinates = []
                const signDateLocateCoordinates = []
                this.signData.outCompanyPositionList.forEach(companyPosition => {
                  if(companyPosition.signTypeItem.signName == item.signName){
                    // x、y为计算之后的拖拽的控件的中心点
                    const x = companyPosition.offsetX + companyPosition.width / 2
                    const y = companyPosition.offsetY + companyPosition.height / 2
                    if(companyPosition.editType == 'company-seal') {
                      signLocateCoordinates.push({
                        x: x,
                        y: y,
                        pageWidth: pageWidth,
                        pageHeight: pageHeight,
                        xRate: x / pageWidth,
                        yRate: y / pageHeight,
                        pageNum: companyPosition.page 
                      })
                    }else if(companyPosition.editType == 'company-date') {
                      signDateLocateCoordinates.push({
                        x: x,
                        y: y,
                        pageWidth: pageWidth,
                        pageHeight: pageHeight,
                        xRate: x / pageWidth,
                        yRate: y / pageHeight,
                        pageNum: companyPosition.page
                      })
                    }
                  }
                })
                return {
                  ...item,
                  companyName: item.signName,
                  signLocateMode: 2,
                  signDateLocateMode: 2,
                  signLocateCoordinates,
                  signDateLocateCoordinates
                }
              })
              this.outCompanyValidPassed = true
            } else {
              this.$message.warning('外部公司签章/外部公司签署日期控件位置未配置！')
              return
            }
          }
        }
        resolve()
      })
    },
    combineLaunchParams(pageWidth, pageHeight){
      return new Promise((resolve, reject) => {
        let resultLabelList = []
        if(this.signData.launchPositionList && this.signData.launchPositionList.length >0) {
          const labelItem = this.stepInfo.postData.labels[0]
          // 拆分数组，将相同名称的控件合并为一个数组
          const mergedArray = this.splitPositionList(this.signData.launchPositionList)
          for(let i = 0; i < mergedArray.length; i++){
            const mergedItem = mergedArray[i]
            // 拖拽的控件存在相同名称的控件，需要将position存成一个list
            if(mergedItem && mergedItem.length > 1) {
              const launchPosition = mergedItem[0]
              let labelConfig = {}
              let labelPosition = []
              let resultItemArr = []
              if(launchPosition.labelName){
                if(launchPosition.signTypeItem.signName == labelItem.signName){
                  // 获取控件信息
                  labelConfig = launchPosition
                  if(!labelConfig.defaultValue){
                    labelConfig.defaultValue = launchPosition.labelName
                  }
                }
              }else{
                this.$message.warning('请设置发起方控件名称')
                reject()
                return
              }
              for(let i = 0; i < mergedItem.length; i++){
                let launchPosition = mergedItem[i]
                if(launchPosition.labelName){
                  if(launchPosition.signTypeItem.signName == labelItem.signName){
                    // x、y为计算之后的拖拽的控件的中心点
                    // const x = launchPosition.offsetX + launchPosition.width / 2
                    // const y = launchPosition.offsetY + launchPosition.height / 2
                    // x、y为计算之后的拖拽的控件的左下坐标点
                    const x = launchPosition.offsetX
                    const y = launchPosition.offsetY + launchPosition.height * 2/3
                    labelPosition.push({
                      x: x,
                      y: y,
                      pageWidth: pageWidth,
                      pageHeight: pageHeight,
                      xRate: x / pageWidth,
                      yRate: y / pageHeight,
                      pageNum: launchPosition.page
                    })
                  }
                }else{
                  this.$message.warning('请设置发起方控件名称')
                  reject()
                  return
                }
              }
              resultItemArr = [{
                ...labelItem,
                label: launchPosition.labelName,
                labelName: labelConfig.labelName,
                isCustomizeLabel: launchPosition.isCustomizeLabel?launchPosition.isCustomizeLabel:null,
                labelConfig,
                labelPosition
              }]
              resultLabelList = resultLabelList.concat(resultItemArr)
            }else{
              let launchPosition = mergedItem[0]
              if(launchPosition.labelName){
                let labelConfig = {}
                let labelPosition = []
                if(launchPosition.signTypeItem.signName == labelItem.signName){
                  // 获取控件信息
                  labelConfig = launchPosition
                  if(!labelConfig.defaultValue){
                    labelConfig.defaultValue = launchPosition.labelName
                  }
                  // x、y为计算之后的拖拽的控件的中心点
                  // const x = launchPosition.offsetX + launchPosition.width / 2
                  // const y = launchPosition.offsetY + launchPosition.height / 2
                  // x、y为计算之后的拖拽的控件的左下坐标点
                  const x = launchPosition.offsetX
                  const y = launchPosition.offsetY + launchPosition.height * 2/3
                  labelPosition.push({
                    x: x,
                    y: y,
                    pageWidth: pageWidth,
                    pageHeight: pageHeight,
                    xRate: x / pageWidth,
                    yRate: y / pageHeight,
                    pageNum: launchPosition.page
                  })
                }
                let resultItemArr = [{
                  ...labelItem,
                  label: launchPosition.labelName,
                  labelName: labelConfig.labelName,
                  isCustomizeLabel: launchPosition.isCustomizeLabel?launchPosition.isCustomizeLabel:null,
                  labelConfig,
                  labelPosition
                }]
                resultLabelList = resultLabelList.concat(resultItemArr)
              }else{
                this.$message.warning('请设置控件名称')
                reject()
                return
              }
            }
            if(resultLabelList.length === mergedArray.length){ 
              resolve(resultLabelList)
            }
          }
        } else {
          this.$message.warning('请添加发起方控件')
          reject()
          return
        }
      })
    },
    splitPositionList(positionList){
      let mergedArray = []
      positionList.forEach(item => {
        let index = mergedArray.findIndex(mergedItem => mergedItem[0].labelName === item.labelName)
        if(index !== -1){
          mergedArray[index].push(item)
        }else{
          mergedArray.push([item])
        }
      })
      return mergedArray
    },
    // ===================================提交===========================
    submit(){
      let templateFileUrl = ''
      let templateImgUrls = ''
      if(this.stepInfo && this.stepInfo.postData && this.stepInfo.postData.templateFileUrl && this.stepInfo.postData.templateFileUrl.originalFileUrl){
        templateFileUrl = this.stepInfo.postData.templateFileUrl.originalFileUrl
      }
      if(this.stepInfo && this.stepInfo.dragImageUrls){
        templateImgUrls = this.stepInfo.dragImageUrls
      }
      const data = {
        tenantCode: this.tenantCode,
        templateCode: this.templateConf.templateCode?this.templateConf.templateCode:'',
        templateName: this.stepInfo.postData.templateName,
        templateType: Number(this.stepInfo.postData.templateType),
        remark: this.stepInfo.postData.remark,
        personSignMsgVOS: this.stepInfo.postData.personSignMsg, // 员工签署方
        companySignMsgVOS: this.stepInfo.postData.companySignMsg, // 公司签署方
        outCompanySignMsgVOS: this.stepInfo.postData.outCompanySignMsg, // 外部签署方
        labels: this.stepInfo.postData.labels, // 发起方
        templateFileUrl: templateFileUrl,
        enabled: '1',
        seq: 1,
        templatePdfUrl: this.stepInfo.postData.templateFileUrl.pdfUrl,
        templateImgUrls: templateImgUrls,
        templateStatus: this.templateStatus,
        // 上传步骤一和步骤二的数据，用于回显
        // 步骤一数据
        stepInfo: this.stepInfo,
        // 步骤二数据
        documentPDF: this.documentPDF
      }
      console.log('===submit data===', data)
      // this.saveLoading = true
      // this.$api.templateConf.saveTemplateNew({
      //   data: data
      // }).then(res => {
      //   if (res.code === 200) {
      //     this.saveLoading = false
      //     if(this.templateStatus === 1){
      //       this.$message.success( '模板配置成功')
      //     }else{
      //       this.$message.success( '草稿保存成功')
      //     }
      //     // 创建完成
      //     this.$store.commit('SET_SUBMIT_STATUS_FOR_TEMP_CONFIG', true)
      //     setTimeout(() => {
      //       this.$router.replace({
      //         name: 'tempPage'
      //       });
      //     }, 200) 
      //   }
      // }).catch(() => {
      //   this.saveLoading = false
      // })
    },
    dragChange(event){

    },
    // 上一步
    preStep(){
      this.$emit('handleStep', {
        preStep:'drag'
      })
    },
    // 点击预览页面，联动左侧签署文件页面滚动
    clickPreviewPage(index){
      const signDom = document.getElementsByClassName('c-scrollbar-wrap')[0]
      const previewDom = this.$refs['preview-content']
      this.currentPageIndex = index
      if(index === 0){
        this.signScrollTop = 0
      }else{
        this.signScrollTop = index * (this.CanvasZoom.height + 16)
      }
      signDom.scrollTo({
        top: this.signScrollTop,
        left:0,
        behavior:'smooth'
      })
      // let percent = this.signScrollTop/(this.signScrollHeight - signDom.clientHeight)
      // setTimeout(() => {
      //   previewDom.scrollTo({
      //     top: this.signScrollTop * percent,
      //     left:0,
      //     behavior:'smooth'
      //   })
      // }, 20)
      signDom.removeEventListener('scroll', this.handleSignScroll, true)
    },

    // 签署文件区域：滚动条联动
    handleSignScroll(){
      const signDom = document.getElementsByClassName('c-scrollbar-wrap')[0]
      console.log('===signDom.scrollTop===', signDom.scrollTop)
      const previewDom = this.$refs['preview-content']
      if(previewDom){
        previewDom.removeEventListener('scroll', this.handlePreviewScroll, true)
        this.signScrollTop = signDom.scrollTop
        this.getCurrentPage()
        let percent = this.signScrollTop/(this.signScrollHeight - signDom.clientHeight)
        setTimeout(() => {
          previewDom.scrollTo({
            top: (this.previewScrollHeight - previewDom.clientHeight) * percent,
            left:0
          })
        }, 20)
      }
    },
    handlePreviewScroll(){
      if(this.draggedControlOperateType === 'preview') {
        const signDom = document.getElementsByClassName('c-scrollbar-wrap')[0]
        const previewDom = this.$refs['preview-content']
        console.log('===previewDom.scrollTop===', previewDom.scrollTop)
        signDom.removeEventListener('scroll', this.handleSignScroll, true)
        this.previewScrollTop = previewDom.scrollTop
        this.getPreviewCurrentPage()
        let percent = this.previewScrollTop/(this.previewScrollHeight - previewDom.clientHeight)
        setTimeout(() => {
          signDom.scrollTo({
            top: (this.signScrollHeight - signDom.clientHeight) * percent,
            left:0
          })
        }, 20)
      }
    },
    // 判断签署文件滚动条当前处于第几页
    getCurrentPage(){
      // CanvasZoom.height * documentPDF.images.length + documentPDF.images.length * 16
      let count = Math.ceil(this.signScrollTop / (this.CanvasZoom.height + 16))
      if(count < 1){
        this.currentPageIndex = 0
      }else{
        this.currentPageIndex = count - 1
      }
    },
    // 判断预览文件滚动条当前处于第几页
    getPreviewCurrentPage(){
      let count = Math.ceil(this.previewScrollTop / 180)
      if(count < 1){
        this.currentPageIndex = 0
      }else{
        this.currentPageIndex = count - 1
      }
    },
    setPosition(position){
      this.currentFocusElement.editInfo.fontPosition = position
    },
    // 左侧控件区域筛选
    selectSignType(item){
      this.widgetParams.signTypeItem = item
      this.widgetParams.signType = item.value
      this.widgetParams.activeTab = 'default'
      if(this.widgetParams.signType === 1){
        this.filterDefaultControlList = this.defaultControlList.filter(item => {
          return item.type === 'launch'
        })
      }else if(this.widgetParams.signType === 2) {
        this.filterDefaultControlList = this.defaultControlList.filter(item => {
          return item.type === 'signature'
        })
      }else if(this.widgetParams.signType === 3) {
        this.filterDefaultControlList = this.defaultControlList.filter(item => {
          return item.type === 'seal'
        })
      }else if(this.widgetParams.signType === 4) {
        this.filterDefaultControlList = this.defaultControlList.filter(item => {
          return item.type === 'outSeal'
        })
      }
    },
    // ==========右侧编辑区域方法==========
    updateEditForm(refName){
      this.$refs[refName].validate((valid) => {
        if(!valid){
          this.$message.warning('请完善控件编辑信息')
        }else{
          const data = {
            ...this.currentFocusElement.editInfo,
            id: this.currentFocusElement.id,
            labelType: 1,
            // label: this.currentFocusElement.labelName,
            tenantCode: this.tenantCode,
            labelRemark: this.currentFocusElement.labelRemark
          }
          this.$api.templateConf.fddCommonLabelUpdForDrag({
            data: data
          }).then(res => {
            if(res && res.code === 200){
              this.$message.success('当前自定义控件更新成功')
              if(this.widgetParams.activeTab === 'custom'){
                this.getCustomControlList()
              }
            }
          })
        }
      })
    },
    saveEditForm(refName){
      this.$refs[refName].validate((valid) => {
        if(!valid){
          this.$message.warning('请完善控件编辑信息')
        }else{
          const data = {
            ...this.currentFocusElement.editInfo,
            labelType: 1,
            // label: this.currentFocusElement.editInfo.labelName,
            tenantCode: this.tenantCode
          }
          this.$api.templateConf.fddCommonLabelAddForDrag({
            data: data
          }).then(res => {
            if(res && res.code === 200){
              this.$message.success('新的自定义控件保存成功')
              if(this.widgetParams.activeTab === 'custom'){
                this.getCustomControlList()
              }
            }
          })
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.elesign {
  display: flex;
  width: 100%;
  height: 100%;
  // flex: 1;
  flex-direction: column;
  position: relative;
  background-color: #f8f9fa;
  margin: auto;
  .row-container{
    height: 800px;
    display: flex;
    flex-direction: row;
    .left-box{
      width: 230px;
      height: 764px;
      padding: 5px 10px 5px 0;
      overflow-y: auto;
      background-color: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      .widget-container{
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        .widget-box{
          width: 100%;
          margin-top: 10px;
        }
      }
    }
    .sign-content{
      flex: 1;
      height: 764px;
      overflow-y: auto;
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
        .page-number{
          display: block;
          position: absolute;
          top: 10px;right: 10px;
          color: #ffffff;
          width: 62px;
          height: 20px;
          line-height: 20px;
          font-size: 12px;
          border-radius: 10px;
          text-align: center;
          vertical-align: middle;
          background-color: rgba(0,0,0,0.7);
        }
      }
    }
    .right-box{
      padding: 5px;
      width: 240px;
      height: 764px;
      overflow-y: auto;
      background-color: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      // &::-webkit-scrollbar{
      //   width:5px;
      //   height:16px;
      //   background-color: rgba(0, 0, 0, 0.2);
      // }
      .right-title{
        margin-bottom: 10px;
        height: 20px;
      }
      .edit-area{ 
        display: flex;
        flex-direction: column;
        background-color: #ffffff;
        padding: 10px 0 10px 15px;
        .update-custom-btn, .save-new-custom-btn{
          width: 100%;
          background-color: #fafafa;
        }
        .label-name-tip{
          font-size: 12px;
          line-height: 16px !important;
          margin-top: 5px;
          color: #666666;
          .el-icon-warning{
            color: #faad15;
            margin-right: 5px;
          }
        }
      }
      .preview-area{
        display: flex;
        flex-direction: column;
        background-color: #ffffff;
        padding: 10px;
        width: 200px;
        height: 100%;
        .preview-page{
          margin: 10px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          .preview-img{
            width: 166px;
            height: 234.38px;
            border: solid 1px #e1e1e1;
            display: flex;
            justify-content: center;
          }
          .page-number{
            margin-top: 10px;
            font-size: 12px;
            color: #3e4b5b;
          }
        }
        .current-preview-page{
          .preview-img{
            border: solid 1px #3860f3;
            border-radius: 2px;
          }
          .page-number{
            color: #3860f3;
          }
        }
      }
    }
  }
  .operate-box{
    position: absolute;
    bottom: -20px;left: 0;right: 0;bottom: -28px;
    height: 60px;
    background-color: #fefefe;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .btn-outline-dark {
      margin: 10px;
      width: 100px;
    }
  }
}

// 左侧控件区域样式
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
  display: flex;
  justify-content: center;
  .entp-seal{
    width: 200px;
    height: 40px;
    margin-bottom: 10px;
  }
}
// .signer-list .li-entp-seal{
//   padding: 0.1rem 0;
// }

.entp-seal{
  width: 200px;
  height: 40px;
  background-color: #f2f2f2;
  justify-content: center;
  align-items: center;
  display: flex;
  padding: 5px;
  user-select: none;
  margin-bottom: 10px;
  cursor: pointer;
  span{
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
  }
}
.person-seal{
  width: 200px;
  height: 40px;
  background-color: #f2f2f2;
  justify-content: center;
  align-items: center;
  display: flex;
  padding: 5px;
  user-select: none;
  margin-bottom: 10px;
  cursor: pointer;
  span{
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
  }
  img{
    width: 160px;
  }
}
.custom-seal{
  width: 200px;
  height: 40px;
  background-color: #f2f2f2;
  justify-content: center;
  align-items: center;
  display: flex;
  padding: 5px 10px;
  user-select: none;
  margin-bottom: 10px;
  cursor: pointer;
  span{
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
  }
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
.edit-mask{
  position: absolute;
  top: 0;right: 0;bottom:0;left: 0;
}
</style>