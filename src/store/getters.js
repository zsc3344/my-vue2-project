const getters = {
  language: state => state.common.language,
  loading: state => state.common.loading,
  userInfo: state => state.user.userInfo,
  breadList: state => state.breadcrumb.breadList
}

export default getters
