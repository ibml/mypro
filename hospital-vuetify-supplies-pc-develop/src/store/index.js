import Vue from 'vue';
import Vuex from 'vuex';
import modules from './modules'

Vue.use(Vuex)

//全局公用状态
const state = {
}
const getters = {
}

const mutations = {
}

const actions = {}

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules:modules
})


export default {
  store
}