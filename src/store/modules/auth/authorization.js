import { axios } from '@/axios'
import Authorization from '@/helpers/Authorization'

export default {
  namespaced: true,
  state: {
    loading: false,
    token: Authorization.getAccessToken(),
    isAuthorized: Authorization.isAuthorized()
  },
  getters: {
    loading (state) {
      return state.loading
    },
    token (state) {
      return state.token
    },
    isAuthorized (state) {
      return state.isAuthorized
    }
  },
  mutations: {
    toggleLoading (state, payload) {
      state.loading = payload
    },
    setToken (state, { token, expiresAt, refreshToken }) {
      Authorization.setData({
        accessToken: token,
        accessTokenExpires: expiresAt,
        refreshToken
      })

      state.token = Authorization.getAccessToken()
      state.isAuthorized = Authorization.isAuthorized()
    },
    clearToken (state) {
      Authorization.clearData()

      state.token = Authorization.getAccessToken()
      state.isAuthorized = Authorization.isAuthorized()
    },
    clearLocalStorage () {
      localStorage.removeItem('user')
      localStorage.removeItem('menu')
    }
  },
  actions: {
    /**
     * Авторизация пользователя.
     *
     * @param commit
     * @param username
     * @param password
     * @param type
     * @param rememberMe
     * @returns {Promise<*>}
     */
    async login ({ commit }, { username, password, type, rememberMe }) {
      commit('toggleLoading', true)

      try {
        const { data } = await axios.post('authorization/login', { username, password, type, rememberMe })

        // Сохранение данных о пользователе
        if (data.user) {
          this.dispatch('user/setUser', data.user)
        }

        // Сохранение токена
        if (typeof data.token === 'object') {
          commit('setToken', data.token)
        }

        commit('toggleLoading', false)
        return Promise.resolve(data)
      } catch (e) {
        commit('toggleLoading', false)
        return Promise.reject(e)
      }
    },

    /**
     * Обновление данных пользователя.
     *
     * @param commit
     * @returns {Promise<*>}
     */
    async updateToken ({ commit }) {
      commit('toggleLoading', true)

      try {
        const { data } = await axios.post('authorization/update-token', {
          refreshToken: Authorization.getRefreshToken()
        })

        // Сохранение токена
        if (typeof data.token === 'object') {
          commit('setToken', data.token)
        }

        commit('toggleLoading', false)
        return Promise.resolve(data)
      } catch (e) {
        commit('toggleLoading', false)
        return Promise.reject(e)
      }
    },

    /**
     * Выход пользователя.
     *
     * @param commit
     */
    async logout ({ commit }) {
      commit('toggleLoading', true)

      try {
        await axios.post('closed/authorization/logout')
      } catch (e) {
      }

      commit('toggleLoading', false)

      // Удаление данных о пользователе
      this.dispatch('user/clearUser')

      // Удаление токена
      commit('clearToken')

      // Очистка localStorage
      commit('clearLocalStorage')

      return true
    },

    /**
     * Авторизация пользователя.
     *
     * @param commit
     * @param email
     * @param password
     * @param retypePassword
     * @param type
     * @returns {Promise<*>}
     */
    async signUp ({ commit }, { email, password, retypePassword, type }) {
      commit('toggleLoading', true)

      try {
        const { data } = await axios.post('authorization/sign-up', {
          SignUpForm: {
            username: email,
            email,
            password,
            retypePassword,
            type
          }
        })

        // Сохранение данных о пользователе
        if (data.user) {
          this.dispatch('user/setUser', data.user)
        }

        // Сохранение токена
        if (data.token) {
          commit('setToken', data.token)
        }

        commit('toggleLoading', false)
        return Promise.resolve(data)
      } catch (e) {
        commit('toggleLoading', false)

        // Удаление данных о пользователе
        this.dispatch('user/clearUser')

        // Удаление токена
        commit('clearToken')

        // Очистка localStorage
        commit('clearLocalStorage')

        return Promise.reject(e)
      }
    },

    /**
     * Изменение пароля.
     *
     * @param commit
     * @param oldPassword
     * @param password
     * @param retypePassword
     * @returns {Promise<*>}
     */
    async changePassword ({ commit }, { oldPassword, password, retypePassword }) {
      commit('toggleLoading', true)

      try {
        const { data } = await axios.post('closed/authorization/change-password', {
          ChangePasswordForm: {
            oldPassword,
            password,
            retypePassword
          }
        })

        commit('toggleLoading', false)
        return Promise.resolve(data)
      } catch (e) {
        commit('toggleLoading', false)
        return Promise.reject(e)
      }
    },

    /**
     * Создание пользователя администратором.
     *
     * @param commit
     * @param email
     * @param password
     * @param retypePassword
     * @param type
     * @returns {Promise<*>}
     */
    async administrationSignUp ({ commit }, { email, password, retypePassword, type }) {
      commit('toggleLoading', true)

      try {
        const { data } = await axios.post('closed/authorization/sign-up', {
          SignUpForm: {
            username: email,
            email,
            password,
            retypePassword,
            type
          }
        })

        commit('toggleLoading', false)
        return Promise.resolve(data)
      } catch (e) {
        commit('toggleLoading', false)
        return Promise.reject(e)
      }
    }
  }
}