const state = {
  language:'zh',
  loading: false
}
const mutations = {
  SET_LANGUAGE: (state,lang) => {
    state.language = lang
  },
  SET_LOADING: (state,loading) => {
    state.loading = loading
  }
}
const actions = {
  setLanguage({ commit }, lang) {
    commit('SET_LANGUAGE', lang)
  },
  setLoading({ commit }, loading) {
    commit('SET_LOADING', loading)
  }
}

export default {
  namespaced: true, // 命名空间： 让代码更好维护，让多种数据分类更加明确
  state,
  mutations,
  actions
}
