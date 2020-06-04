import authorization from './modules/auth/authorization'
import general from './modules/general/general'
import menu from './modules/menu/menu'
import user from './modules/user/user'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    authorization,
    general,
    menu,
    user
  }
})
