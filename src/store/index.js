import Vue from 'vue'
import Vuex from 'vuex'

import common from './modules/common'
import breadcrumb from './modules/breadcrumb'
import user from './modules/user'
import dragForTempConfig from './modules/dragForTempConfig'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules:{
    common,
    breadcrumb,
    user,
    dragForTempConfig
  },
  getters
})

export default store
