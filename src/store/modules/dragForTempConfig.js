const dragForTempConfig = {
  state: {
    operateType: 'add',
    pageWidth: 0,
    pageHeight: 0,
    submitStatusForTempConfig: true,
    dragStepInfoForTempConfig: null,
    dragDocumentPDFForTempConfig:null
  },
  mutations: {
    SET_OPERATE_TYPE: (state, param) => {
      state.operateType = param
    },
    SET_PAGE_WIDTH: (state, param) => {
      state.pageWidth = param
    },
    SET_PAGE_HEIGHT: (state, param) => {
      state.pageHeight = param
    },
    SET_SUBMIT_STATUS_FOR_TEMP_CONFIG: (state, param) => {
      state.submitStatusForTempConfig = param
    },
    SET_STEP_INFO_FOR_TEMP_CONFIG: (state, param) => {
      state.dragStepInfoForTempConfig = param
    },
    SET_DOCUMENT_PDF_FOR_TEMP_CONFIG: (state, param) => {
      state.dragDocumentPDFForTempConfig = param
    }
  },
  actions: {

  }
}

export default dragForTempConfig
