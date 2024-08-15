const getters = {
  language: state => state.common.language,
  loading: state => state.common.loading,
  userInfo: state => state.user.userInfo,
  breadList: state => state.breadcrumb.breadList,
  operateType: state => state.dragForTempConfig.operateType,
  pageWidth: state => state.dragForTempConfig.pageWidth,
  pageHeight: state => state.dragForTempConfig.pageHeight,
  submitStatusForTempConfig: state => state.dragForTempConfig.submitStatusForTempConfig,
  dragStepInfoForTempConfig: state => state.dragForTempConfig.dragStepInfoForTempConfig,
  dragDocumentPDFForTempConfig: state => state.dragForTempConfig.dragDocumentPDFForTempConfig
}

export default getters
