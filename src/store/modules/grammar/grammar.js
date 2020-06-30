import { axios } from '../../../axios'

export default {
  namespaced: true,
  state: {
    levels: []
  },
  getters: {},
  mutations: {
    setLevels (state, payload) {
      state.levels = payload
    }
  },
  actions: {
    getLevels ({ commit }) {
      this.dispatch('general/startLoading')
      axios.post('grammar/level/index')
        .then(
          response => {
            console.log(1, response)
            commit('setLevels', response.data.query)
          },
          reject => { console.log(2, reject.response) })
        .catch(error => { console.log(3, error) })
        .finally(() => { this.dispatch('general/stopLoading') })
    }
  }
}
