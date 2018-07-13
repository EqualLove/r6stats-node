'use strict'

import axios from 'axios'

import MissingUserAgentError from './errors/MissingUserAgentError'
import AuthenticationError from './errors/AuthenticationError'
import NotAuthenticatedError from './errors/NotAuthenticatedError'
import PlayerStatsModule from './modules/PlayerStatsModule'


class R6StatsAPI {
  constructor ({ loginId, password, userAgent=null, baseUrl=null, options=null }) {
    if (!baseURL) throw new Error('Base URL must be provided before release')
    if (!userAgent) throw new MissingUserAgentError('A user agent must be specified for client recognition')

    this.authConfig = { loginId, password }
    this.authData = { token: null }

    this.$axios = axios.create(this._baseConfig({ baseUrl, userAgent, options }))

    new PlayerStatsModule(this)
  }

  async authenticate () {
    try {
      const { data: { payload: { token } } } = await this.$axios({
        method: 'post',
        url: '/auth/login',
        data: {
          login_id: this.authConfig.loginId,
          password: this.authConfig.password
        }
      })
      this.authData.token = token
    } catch (e) {
      let msg
      switch (e.response.status) {
        case 401:
        msg = 'Invalid login or password'
        break
        case 422:
        msg = 'Login or password not provided'
        break
        default:
        msg = 'Unknown authentication error occurred'
        break
      }
      throw new AuthenticationError(msg)
    }
  }

  async call (config) {
    if (!this.isAuthenticated) throw new NotAuthenticatedError('The client must call .authenticate() before making API calls')
    return await this.$axios({
      headers: {
        'Authorization': `Bearer: ${ this.authData.token }`
      },
      ...config
    })
  }

  isAuthenticated () {
    return this.authData.token != null
  }


  _baseConfig (config) {
    return {
        baseURL: config.baseUrl,
        headers: {
          'User-Agent': config.userAgent,
          'Content-Type': 'application/json'
        },
        ...config.options
      }
    }
}

export default R6StatsAPI
