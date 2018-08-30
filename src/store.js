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
      console.log(state.connectStat)
      alert('connectStat is ' + state.connectStat)
      let connection = navigator.connection
      console.log(connection)
      alert(connection)
    }
  }
})

export default store
