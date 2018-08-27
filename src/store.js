import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    connectStat: true
  },
  getters: {
    connectStat (state) { return state.connectStat }
  },
  mutations: {
    setConnectStat (state, payload) {
      state.connectStat = payload.connectStat
      alert('connectStat is ' + state.connectStat)
      console.log(state.connectStat)
    }
  }
})

export default store
