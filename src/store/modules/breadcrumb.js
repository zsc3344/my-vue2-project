const state = {
  breadList:[]
}
const mutations = {
  ADD_ROUTE: (state, route) => {
    state.breadList.push(route)
  },
  DELETE_ROUTE: (state, route) => {
    state.breadList.pop(route)
  },
  CHANGE_BREAD_LIST: (state, breadList) => {
    state.breadList = breadList
  }
}
const actions = {
  addRoute({ commit }, route){
    commit('ADD_ROUTE', route)
  },
  deleteRoute({ commit }, route){
    commit('DELETE_ROUTE', route)
  },
  changeBreadList({ commit }, breadList){
    commit('CHANGE_BREAD_LIST', breadList)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
