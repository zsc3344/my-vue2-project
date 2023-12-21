import Vue from 'vue'
import Vuex from 'vuex'

import common from './modules/common'
import breadcrumb from './modules/breadcrumb'
import user from './modules/user'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules:{
    common,
    breadcrumb,
    user
  },
  getters
})

export default store
