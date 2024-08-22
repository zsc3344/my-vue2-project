<template>
  <div class="add-template-container">
    <template>
      <addTemp v-show="currentStep === 'add'" ref="addTemp" @handleStep="setCurrentStep"></addTemp>
    </template>
    <template v-if="currentStep === 'drag'">
      <dragTemp ref="dragTemp" @handleStep="setCurrentStep"></dragTemp>
    </template>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import addTemp from './components/addTemp.vue'
import dragTemp from './components/dragTemp/index.vue'
export default {
  props:{

  },
  components:{
    addTemp,
    dragTemp
  },
  data() {
    return {
      currentStep:'add',
      stepInfo:{
        operateType:'add',
        rowData:{},
        dragImageUrls: [],
        postData: {}
      }
    }
  },
  computed:{
    ...mapGetters(['tenantCode', 'operateType', 'pageWidth','pageWidth','submitStatusForTempConfig','dragStepInfoForTempConfig','dragDocumentPDFForTempConfig','clickChangeTenantBtnStatus'])
  },
  created(){
    if(this.$route.params){
      if(this.$route.params.rowData){
        this.stepInfo.rowData = this.$route.params.rowData
      }
    }
    if(this.$route.query){
      if(this.$route.query.operateType){
        this.stepInfo.operateType = this.$route.query.operateType
        this.$store.commit('SET_OPERATE_TYPE', this.stepInfo.operateType)
      }
      this.getTemplateInfo()
    }
  },
  methods:{
    async getTemplateInfo(){
      if (this.$route.query && this.$route.query.templateCode) {
        const templateCode = this.$route.query.templateCode
        const templateInfo = await this.getTemplateByName(templateCode)
        if (templateInfo) {
          if(templateInfo.stepInfo){
            const data = {
              ...templateInfo.stepInfo,
              operateType: this.stepInfo.operateType,
              rowData: this.stepInfo.rowData
            }
            this.$store.commit('SET_STEP_INFO_FOR_TEMP_CONFIG', data)
          }
          if(templateInfo.documentPDF){
            this.$store.commit('SET_DOCUMENT_PDF_FOR_TEMP_CONFIG', templateInfo.documentPDF)
          }
        }
      }
    },
    // 获取模板内容
    async getTemplateByName(templateCode) {
      const { data } = await this.$api.templateConf.selectByTemplateCode({
        data: {
          templateCode: templateCode,
        }
      })
      if(data && data.length > 0){
        return data[0]
      }
    },
    setCurrentStep(data){
      if(data.preStep === 'add'){
        const { dragImageUrls, postData } = data
        this.stepInfo.dragImageUrls = dragImageUrls
        this.stepInfo.postData = postData
        this.$store.commit('SET_STEP_INFO_FOR_TEMP_CONFIG', this.stepInfo)
        if(this.dragDocumentPDFForTempConfig){
          this.filterAndSetDocumentPdf(this.dragDocumentPDFForTempConfig)
        }
        this.currentStep = 'drag'
      }else if(data.preStep === 'drag'){
        this.currentStep = 'add'
      }
    },
    // 编辑时，如果第一步删除了某个签署方，则下一步的控件也需要删除相对应的签署方的控件
    filterAndSetDocumentPdf(documentPDF){
      for(let i in this.stepInfo.postData){
        if(i === 'personSignMsg' && this.stepInfo.postData[i].length === 0){
          documentPDF.control = documentPDF.control.filter(item => {
            return item.type !== 'signature'
          })
          this.$store.commit('SET_DOCUMENT_PDF_FOR_TEMP_CONFIG', documentPDF)
        }
        if(i === 'companySignMsg' && this.stepInfo.postData[i].length === 0){
          documentPDF.control = documentPDF.control.filter(item => {
            return item.type !== 'seal'
          })
          this.$store.commit('SET_DOCUMENT_PDF_FOR_TEMP_CONFIG', documentPDF)
        }
        if(i === 'outCompanySignMsg' && this.stepInfo.postData[i].length === 0){
          documentPDF.control = documentPDF.control.filter(item => {
            return item.type !== 'outSeal'
          })
          this.$store.commit('SET_DOCUMENT_PDF_FOR_TEMP_CONFIG', documentPDF)
        }
      }
    }
  }
}
</script>
<style scoped lang="scss">
.add-template-container {
  display: flex;
  flex-direction: column;
}
::v-deep .el-dialog{
  margin-top: 0vh !important;
  min-height: 900px !important;
  .el-dialog__body{
    padding: 0 20px !important
  }
}
</style>