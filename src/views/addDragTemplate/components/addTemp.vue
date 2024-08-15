<template>
  <div class="add-temp-container">
    <div class="title-box">
      <span class="title">新增模板</span>
    </div>
    <div class="content-box">
      <el-form :model="templateConf" :disabled="operateType === 'check'" :rules="rules" ref="dragTemplateConf" label-width="100px" class="demo-templateConf" label-position="left">
        <div class="sub-title">模板信息</div>
        <div class="sub-form">
          <div class="upload-area">
            <el-form-item label="签署文件：" prop="templateFileUrl">
              <div v-if="!templateConf.templateFileUrl.originalFileUrl">
                <el-button class="" type="primary" @click="uploadTemplate($event, 'templateFileUrl', ['pdf','jpeg','jpg','png','doc','docx'])">上传签署文件</el-button>
                <span class="template-type">仅支持pdf、jpeg、jpg、png、doc、docx,文件大小不超过50M</span>
              </div>
              <div
                  v-else
                  class="upload-area-uploaded"
              >
                <div class="file-area">
                  <div class="file-name">
                    <i class="el-icon-document-checked file-logo"></i>
                    <span>{{ parseFileName(templateConf.templateFileUrl.originalFileUrl) }}</span>
                  </div>
                  <div v-if="operateType !== 'check'" class="file-handle">
                    <span class="file-update" @click="uploadTemplate($event, 'templateFileUrl', ['doc', 'docx','pdf'])">更新</span>
                    <span class="file-download" @click="downIt(templateConf.templateFileUrl.originalFileUrl)">下载</span>
                    <span class="file-delete" @click.self="deleteFile($event, 'templateFileUrl', ['doc', 'docx','pdf'])">删除</span>
                  </div>
                </div>
              </div>
            </el-form-item>
          </div>
        <el-form-item label="模板名称：" prop="templateName">
          <el-input 
            v-model="templateConf.templateName" 
            placeholder="请输入模板名称（只能输入中文、英文、数字和下划线_）"
            maxlength="50"
            onkeyup="this.value=this.value.replace(/[^\w_^\u4E00-\u9FA5]/g,'');"
          ></el-input>
        </el-form-item>
        <el-form-item label="模板类型：" prop="templateType">
          <el-select 
            v-model="templateConf.templateType" 
            placeholder="请选择模板类型"
            @change="changeTemplateType"
          >
            <el-option 
              v-for="item in contractTypeList"
              :label="item.dictName"
              :key="item.dictValue"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input
              v-model.trim="templateConf.remark"
              maxlength="200"
              show-word-limit
              type="textarea"
              :rows="3"
              placeholder="请输入备注"
          />
        </el-form-item>
        </div>
        <div class="sub-title">签署信息</div>
        <div class="sub-form">
          <div class="launch-box sign-box" v-for="(item, index) in templateConf.labels" :key="'launch'+index">
            <div class="left-box">
              <el-form-item label="" :error="!item.signName && !isPassValidated ? ' ' : ''" class="form-item-box">
                <p class="sign-title">签署对象名称</p>
                <el-input class="sign-input" v-model.trim="item.signName" readonly maxlength="20" placeholder="发起方"></el-input>
              </el-form-item>
              <p class="sign-desc">签署对象类型：公司</p>
            </div>
            <div class="right-box">
              <span>注释：发起方负责模板配置，合同填充和推送签署</span>
            </div>
          </div>
          <div class="personal-box sign-box" v-for="(item, index) in templateConf.personSignMsg" :key="'person'+index">
            <div class="left-box">
              <el-form-item label="" :error="!item.signName && !isPassValidated ? ' ' : ''" class="form-item-box">
                <p class="sign-title">签署对象名称</p>
                <el-input class="sign-input" v-model.trim="item.signName"  maxlength="20" placeholder="员工"></el-input>
              </el-form-item>
              <p class="sign-desc">签署对象类型：个人</p>
            </div>
            <div class="right-box">
              <el-button icon="el-icon-delete" type="danger" @click="deleteSignConf('personSignMsg', index)">删除</el-button>
            </div>
          </div>
          <div class="company-box sign-box" v-for="(item, index) in templateConf.companySignMsg" :key="'company'+index">
            <div class="left-box">
              <el-form-item label="" :error="!item.signName && !isPassValidated ? ' ' : ''" class="form-item-box">
                <p class="sign-title">签署对象名称</p>
                <el-input class="sign-input" v-model.trim="item.signName"  maxlength="20" placeholder="甲方公司"></el-input>
              </el-form-item>
              <p class="sign-desc">签署对象类型：公司</p>
            </div>
            <div class="right-box">
              <el-button icon="el-icon-delete" type="danger" @click="deleteSignConf('companySignMsg', index)">删除</el-button>
            </div>
          </div>
          <div class="outCompany-box sign-box" v-for="(item, index) in templateConf.outCompanySignMsg" :key="'outCompany'+index">
            <div class="left-box">
              <el-form-item label="" :error="!item.signName && !isPassValidated ? ' ' : ''" class="form-item-box">
                <p class="sign-title">签署对象名称</p>
                <el-input class="sign-input" v-model.trim="item.signName"  maxlength="20" placeholder="乙方公司"></el-input>
              </el-form-item>
              <p class="sign-desc">签署对象类型：外部公司</p>
            </div>
            <div class="right-box">
              <el-button icon="el-icon-delete" type="danger" @click="deleteSignConf('outCompanySignMsg', index)">删除</el-button>
            </div>
          </div>
        </div>
        <div class="btn-items">
          <div class="btn-item">
            <el-button type="primary" @click="addSignConfig('companySignMsg')" icon="el-icon-plus" :disabled="isAddCompanySignDisabled">添加签署公司</el-button>
            <div v-if="isAddCompanySignDisabled" class="add-company-error">公司配置数已达上限</div>
          </div>
          <div class="btn-item" v-if="templateConf.personSignMsg.length === 0">
            <el-button type="primary" @click="addSignConfig('personSignMsg')" icon="el-icon-plus">添加签署人</el-button>
          </div>
          <div class="btn-item">
            <el-button v-if="templateConf.templateType === '9'" type="primary" @click="addSignConfig('outCompanySignMsg')" icon="el-icon-plus" :disabled="isAddOutAuthCompanySignDisabled">添加外部公司</el-button>
            <div v-if="isAddOutAuthCompanySignDisabled" class="add-company-error">对外公司配置数已达上限</div>
          </div>
        </div>
      </el-form>
    </div>
    <div class="operate-box">
      <el-button type="primary" class="step-btn" @click="nextStep()">下一步</el-button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { uploadFileForDrag, downloadFileForTemp} from '@/utils/util'
export default {
  data() {
    return {
      operateType: 'add',
      templateConf: {
        templateFileUrl: {
          "pdfUrl": "https://paas-test-1302914566.cos.ap-nanjing.myqcloud.com/com.junrunrenli.esp/dfb381d0-5a84-494a-80e5-9005c6a28fa2.pdf",
          "imageUrls": [
              "https://paas-test-1302914566.cos.ap-nanjing.myqcloud.com/com.junrunrenli.esp/600b62a387ae4ac08bd79b45adda5878pic01.png",
              "https://paas-test-1302914566.cos.ap-nanjing.myqcloud.com/com.junrunrenli.esp/8b38303a9caf4799bdeaa742dfb7802epic11.png",
              "https://paas-test-1302914566.cos.ap-nanjing.myqcloud.com/com.junrunrenli.esp/12697c91030d4a2d8fedba4319a2be8dpic21.png",
              "https://paas-test-1302914566.cos.ap-nanjing.myqcloud.com/com.junrunrenli.esp/84ca688dee0e4811a1df59268f865212pic31.png",
              "https://paas-test-1302914566.cos.ap-nanjing.myqcloud.com/com.junrunrenli.esp/5b52e1efd4764e9cafa424fadce381efpic41.png"
          ],
          "originalFileUrl": "https://paas-test-1302914566.cos.ap-nanjing.myqcloud.com/com.junrunrenli.esp/20598efd75e04f2aaf2a9984a53e5b46TX音乐劳动合同.docx"
        },
        templateName: '',
        templateType: '',
        remark: '',
        labels: [
          {
            signName: '发起方',
            type:'launch'
          }
        ],
        personSignMsg: [
          {
            signName: '',
            type:'personal'
          }
        ],
        companySignMsg: [
          {
            signName: '',
            type:'company'
          }
        ],
        outCompanySignMsg: []
      },
      contractTypeList: [],
      labelPosition: 'left',
      rules: {
        templateFileUrl: [
          { required: true, message: '请上传签署文件', trigger: 'change' }
        ],
        templateName: [
          { required: true, message: '请输入模板名称', trigger: 'blur' }
        ],
        templateType: [
          { required: true, message: '请选择模板类型', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'blur' }
        ]
      },
      uploadLoading: false,
      // 是否通过校验
      isPassValidated: true,
      // 是否能继续添加公司签署配置
      isAddCompanySignDisabled: false,
      // 是否能继续添加对外公司签署配置
      isAddOutAuthCompanySignDisabled: false
    }
  },
  computed:{
    ...mapGetters(['tenantCode', 'dragStepInfoForTempConfig'])
  },
  watch:{
    'templateConf.companySignMsg':{
        handler(newVal){
          if(newVal.length < 5){
            this.isAddCompanySignDisabled = false
          }else{
            this.isAddCompanySignDisabled = true
          }
        }
      },
      'templateConf.outCompanySignMsg':{
        handler(newVal){
          if(newVal.length < 5){
            this.isAddOutAuthCompanySignDisabled = false
          }else{
            this.isAddOutAuthCompanySignDisabled = true
          }
        }
      },
      'dragStepInfoForTempConfig':{
        handler(newVal){
          if(newVal && newVal.postData){
            for(let i in this.templateConf){
              if(i !== 'labels' && newVal.postData[i]){
                this.templateConf[i] = newVal.postData[i]
              }
            }
          }
          if(newVal && newVal.operateType){
            this.operateType = newVal.operateType
          }
        },
        deep:true,
        immediate:true
      }
  },
  created(){
    this.getContractTypeList()
    this.$store.commit('SET_SUBMIT_STATUS_FOR_TEMP_CONFIG', false)
  },
  methods:{
    // 上传模板
    async uploadTemplate(e, key, types) {
      this.templateConf = Object.assign({}, this.templateConf, {
        [key]: await uploadFileForDrag(types),
      });
      this.$store.commit('SET_DOCUMENT_PDF_FOR_TEMP_CONFIG', null)
      if(this.templateConf && this.templateConf.templateFileUrl && this.templateConf.templateFileUrl.originalFileUrl.endsWith('.pdf')){
        this.uploadType = 'pdf'
      }
      this.$store.commit('SET_DOCUMENT_PDF_FOR_TEMP_CONFIG', null)
      this.$message.success('上传成功！')
    },
    parseFileName(url){
      if (url) {
        let file = url.split('com/')[1];
        let fileName = file.substring(32, file.length)
        return fileName
      }
    },
    downIt(url) {
      if (url) {
        let fileName = this.parseFileName(url)
        downloadFileForTemp(url, fileName)
      }
    },
    deleteFile(e, key, types){
      this.templateConf = Object.assign({}, this.templateConf, {
        [key]: '',
      });
      this.$store.commit('SET_DOCUMENT_PDF_FOR_TEMP_CONFIG', null)
    },
    changeTemplateType(){
      if(this.templateConf.templateType !== '9'){
        this.templateConf.outCompanySignMsg = []
      }else{
        this.templateConf.outCompanySignMsg = [
          {
            signName: '',
            type:'outCompany'
          }
        ]
      }
    },
    // 添加签署方协议
    addSignConfig(key){
      if(key === 'companySignMsg') {
        if(this.templateConf.companySignMsg.length < 5){
          this.isAddCompanySignDisabled = false
          this.templateConf = Object.assign(this.templateConf, {
            [key]: [
              ...this.templateConf[key],
              {
                signName: '',
                type:'company'
              },
            ],
          });
        }else{
          this.isAddCompanySignDisabled = true
        }
      }else if(key === 'personSignMsg') {
        this.templateConf = Object.assign(this.templateConf, {
          [key]: [
            ...this.templateConf[key],
            {
              signName: '',
              type:'personal'
            },
          ],
        })
      }else if(key === 'outCompanySignMsg') {
        if(this.templateConf.outCompanySignMsg.length < 5){
          this.isAddOutAuthCompanySignDisabled = false
          this.templateConf = Object.assign(this.templateConf, {
            [key]: [
              ...this.templateConf[key],
              {
                signName: '',
                type:'outCompany'
              },
            ],
          });
        }else{
          this.isAddOutAuthCompanySignDisabled = true
        }
      }
    },
    // 删除签署方配置
    deleteSignConf(key, index) {
      this.templateConf[key].splice(index, 1);
    },
    // 校验数据
    validateData() {
      if (
          !this.templateConf.templateFileUrl.originalFileUrl ||
          !this.templateConf.templateName ||
          !this.templateConf.templateType
      ) {
        return false;
      }
      const companySignMsg = this.templateConf.companySignMsg;
      const outCompanySignMsg = this.templateConf.outCompanySignMsg;
      const personSignMsg = this.templateConf.personSignMsg;
      let isPass = true;
      if (companySignMsg.length) {
        companySignMsg.forEach(item => {
          if (item.signName === '') {
            isPass = false;
          }
        });
      }
      if (personSignMsg.length) {
        personSignMsg.forEach(item => {
          if (item.signName === '') {
            isPass = false;
          }
        });
      }

      if (outCompanySignMsg.length > 0) {
        outCompanySignMsg.forEach(item => {
          if (item.signName === '') {
            isPass = false;
          }
        });
      }

      if (!isPass) {
        return false;
      }

      const personSignConf = this.templateConf.personSignMsg.filter(
          (item) => !item.signName
      );
      const companySignConf = this.templateConf.companySignMsg.filter(
          (item) => !item.signName
      );
      if(this.templateConf.outCompanySignMsg.length > 0){
        const outCompanySignConf = this.templateConf.outCompanySignMsg.filter(
          (item) => !item.signName
        )
        if (personSignConf.length || companySignConf.length || outCompanySignConf.length) {
          return false
        }
      }else{
        if (personSignConf.length || companySignConf.length) {
          return false
        }
      }
      return true;
    },
    // 校验赋值
    checkAndUse() {
      this.$refs.dragTemplateConf.validate((valid) => {
        if (!valid) {
          // this.$message.error('请填写完整信息后保存！')
          return false
        }
      })
      this.isPassValidated = this.validateData();
      console.log(this.isPassValidated, 'this.isPassValidated');
      if (!this.isPassValidated) {
        return false;
      }
      // this.$message.success('信息验证通过');
      this.templateConf = Object.assign({}, this.templateConf, {
        personSignMsg: this.templateConf.personSignMsg.map(
            (item, index) => Object.assign(item, {index: index + 1})
        ),
        companySignMsg: this.templateConf.companySignMsg.map(
            (item, index) => Object.assign(item, {index: index + 1})
        ),
        outCompanySignMsg: this.templateConf.outCompanySignMsg.map(
            (item, index) => Object.assign(item, {index: index + 1})
        )
      });
      return true;
    },
    nextStep() {
      if(!this.checkAndUse()){
        this.$message.error('请填写完整信息后保存！')
        return
      }else{
        // 此处需要保存第一步信息为草稿
        this.$emit('handleStep', {
          preStep:'add',
          dragImageUrls: this.templateConf.templateFileUrl.imageUrls,
          postData: this.templateConf
        })
      }
    },
    // ===========离开当前页面，需要保存第一步信息为草稿============
    validateDataForDraft(){
      if (
          !this.templateConf.templateFileUrl.originalFileUrl ||
          !this.templateConf.templateName
      ) {
        return false
      }else{
        return true 
      }
    },
    // 校验保存草稿：第一步数据
    checkAndUseForDraft() {
      this.isPassValidated = this.validateDataForDraft();
      console.log(this.isPassValidated, 'this.isPassValidated');
      if (!this.isPassValidated) {
        return false;
      }
      this.templateConf = Object.assign({}, this.templateConf, {
        personSignMsg: this.templateConf.personSignMsg.map(
            (item, index) => Object.assign(item, {index: index + 1})
        ),
        companySignMsg: this.templateConf.companySignMsg.map(
            (item, index) => Object.assign(item, {index: index + 1})
        ),
        outCompanySignMsg: this.templateConf.outCompanySignMsg.map(
            (item, index) => Object.assign(item, {index: index + 1})
        )
      });
      return true;
    },
    saveAddStepInfoForDraft() {
      if(!this.checkAndUseForDraft()){
        // this.$message.error('请填写完整信息后保存！')
        return
      }else{
        const data = {
          dragImageUrls: this.templateConf.templateFileUrl.imageUrls,
          postData: this.templateConf
        }
        this.$store.commit('SET_STEP_INFO_FOR_TEMP_CONFIG', data)
      }
    },
    // ===========离开当前页面，需要保存第一步信息为草稿============
    resetForm(formName) {
      this.$refs[formName].resetFields();
      const {templateConf} = this.$options.data();
      this.templateConf = templateConf;
      this.isPassValidated = true
    },
    
    async getContractTypeList() {
      this.contractTypeList = [
        {
            "id": 2,
            "dictName": "劳动合同",
            "dictCode": "contract_type_labor_contract",
            "dictType": "contract_type",
            "parentCode": "contract_type",
            "dictValue": "1",
            "dictStatus": 1,
            "remark": "合同类型-劳动合同",
            "createName": "xuezheng1",
            "createDate": "2021-12-14 14:16:16",
            "updateName": "xuezheng1",
            "updateDate": "2021-12-23 17:22:28",
            "children": null
        },
        {
            "id": 3,
            "dictName": "入职资料",
            "dictCode": "contract_type_entry_information",
            "dictType": "contract_type",
            "parentCode": "contract_type",
            "dictValue": "2",
            "dictStatus": 1,
            "remark": "合同类型-入职资料",
            "createName": "xuezheng1",
            "createDate": "2021-12-14 14:16:16",
            "updateName": "xuezheng1",
            "updateDate": "2021-12-14 14:16:16",
            "children": null
        },
        {
            "id": 4,
            "dictName": "商务协议",
            "dictCode": "contract_type_business_agreement",
            "dictType": "contract_type",
            "parentCode": "contract_type",
            "dictValue": "3",
            "dictStatus": 1,
            "remark": "合同类型-商务协议",
            "createName": "xuezheng1",
            "createDate": "2021-12-14 14:16:16",
            "updateName": "xuezheng1",
            "updateDate": "2022-11-24 10:55:00",
            "children": null
        },
        {
            "id": 5,
            "dictName": "离职签署",
            "dictCode": "contract_type_resign_sign",
            "dictType": "contract_type",
            "parentCode": "contract_type",
            "dictValue": "4",
            "dictStatus": 1,
            "remark": "合同类型-离职签署",
            "createName": "xuezheng1",
            "createDate": "2021-12-14 14:16:16",
            "updateName": "xuezheng1",
            "updateDate": "2021-12-16 11:11:46",
            "children": null
        },
        {
            "id": 6,
            "dictName": "其他",
            "dictCode": "contract_type_other",
            "dictType": "contract_type",
            "parentCode": "contract_type",
            "dictValue": "5",
            "dictStatus": 1,
            "remark": "合同类型-其他",
            "createName": "zhuxiangyang",
            "createDate": "2022-11-24 10:58:57",
            "updateName": "zhuxiangyang",
            "updateDate": "2023-03-06 16:33:22",
            "children": null
        },
        {
            "id": 7,
            "dictName": "证明材料",
            "dictCode": "contract_type_prove_material",
            "dictType": "contract_type",
            "parentCode": "contract_type",
            "dictValue": "6",
            "dictStatus": 1,
            "remark": "合同类型-证明材料",
            "createName": "zhuxiangyang",
            "createDate": "2023-03-06 16:23:20",
            "updateName": "zhuxiangyang",
            "updateDate": "2023-03-06 16:24:57",
            "children": null
        },
        {
            "id": 8,
            "dictName": "项目承揽",
            "dictCode": "contract_type_project_contract",
            "dictType": "contract_type",
            "parentCode": "contract_type",
            "dictValue": "7",
            "dictStatus": 1,
            "remark": "合同类型-项目承揽",
            "createName": "zhuxiangyang",
            "createDate": "2023-03-06 16:26:33",
            "updateName": "zhuxiangyang",
            "updateDate": "2023-03-06 16:27:34",
            "children": null
        },
        {
            "id": 9,
            "dictName": "通知声明",
            "dictCode": "contract_type_notice_statement",
            "dictType": "contract_type",
            "parentCode": "contract_type",
            "dictValue": "8",
            "dictStatus": 1,
            "remark": "合同类型-通知声明",
            "createName": "zhuxiangyang",
            "createDate": "2023-03-06 16:28:46",
            "updateName": "zhuxiangyang",
            "updateDate": "2023-03-06 16:29:20",
            "children": null
        },
        {
            "id": 92,
            "dictName": "商务协议(对外)",
            "dictCode": "contract_type_out_company",
            "dictType": "contract_type",
            "parentCode": "contract_type",
            "dictValue": "9",
            "dictStatus": 1,
            "remark": "商务协议(对外)",
            "createName": "admin",
            "createDate": "2024-07-05 18:45:23",
            "updateName": "admin",
            "updateDate": "2024-07-05 18:45:23",
            "children": null
        }
      ]
    }
  }
}
</script>
<style scoped lang="scss">
.add-temp-container {
  display: flex;
  flex-direction: column;
  .title-box{
    width: 100%;
    height: 40px;
    font-size: 16px;
    font-weight: 600;
    display: flex;
    justify-content: center;
    border-bottom: solid 1px #e6e6e6;
  }
  .content-box{
    padding: 20px;
    height: 760px;
    overflow-y: auto;
    .sub-title{
      font-size: 18px;
      font-weight: 600;
    }
    .sub-form{
      margin: 10px 0 0 50px;
      .upload-area{
        width: 100%;
        padding: 10px;
        background-color: #f2f2f2;
        border-radius: 4px;
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        .template-type{
          margin-left: 10px;
        }
        .upload-area-uploaded{
          padding: 0 10px 0 0;
          .file-area{
            display: flex;
            flex-direction: row;
            align-items: center;
            cursor: pointer;
            .file-name{
              width: 400px;
              text-overflow: ellipsis;
              overflow: hidden;
              word-break: break-all;
              white-space: nowrap;
              span{
                color: #3860f3;
              }
            }
            .file-logo{
              margin-right: 5px;
            }
            .file-handle{
              margin-left: 20px;
              .file-update, .file-download{
                margin-right: 10px;
                color: #3860f3;
              }
              .file-delete{
                color: #ff4d4d;
              }
            }
          }
        }
        .upload-area-uploaded:hover{
          width: 100%;
          background-color: #f7f8fc;
        }
      }
      .sign-box{
        display: flex;
        align-items: center;
        min-width: 1200px;
        background-color: #f2f2f2;
        border-radius: 4px;
        padding: 15px 15px;
        margin: 10px 0;
        .left-box{
          width: 60%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .form-item-box{
            ::v-deep .el-form-item__content{
              display: flex;
              align-items: center;
              margin-bottom: 0 !important;
              .el-input{
                width: 400px !important;
              }
            }
            .sign-title{
              width: 200px;
            }
          }
          .sign-desc{
            min-width: 300px;
            margin-left: 20px;
          }
        }
        .right-box{
          width: 40%;
          text-align: right;
        }
      }
    }
    .btn-items{
      margin: 10px 0 0 50px;
      display: flex;
      align-items: center;
      .btn-item{
        height: 50px;
        margin-right: 10px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        .add-company-error{
          color: #ec2d30;
          margin-top: 5px;
        }
      }
    }
  }
  .operate-box{
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
    z-index: 9;
    padding: 14px 25px;
    background-color: #fff;
    box-shadow: 0 1px 6px rgba(0,0,0,.1);
    .step-btn{
      width: 100px;
    }
  }
}
::v-deep .el-form-item--small.el-form-item {
  margin-bottom: 0 !important;
  .el-form-item__content{
    margin: 0 0 15px 10px !important;
  }
}
::v-deep .el-form-item__label{
  text-align: left !important;
}
::v-deep .el-form-item__error{
  left: 96px !important
}
::v-deep .el-input{
  width: 600px !important;
}
::v-deep .el-select{
  width: 600px !important;
}
::v-deep .el-textarea{
  width: 600px !important;
}
</style>