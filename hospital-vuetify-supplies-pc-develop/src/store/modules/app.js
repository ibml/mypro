const state = {
	isLogin:false
}

const getters = {

}

const mutations = {
	SET_LOGIN_STATE(state, isLogin) {
			state.isLogin = isLogin;
	}
}

const actions = {
   setLoginState({ commit }, loginState) {
    commit('SET_LOGIN_STATE', loginState)
  }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}