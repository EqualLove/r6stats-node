import axios, { AxiosInstance } from 'axios'
import { operatorStats, playerStats, seasonalStats, weaponCategoryStats, weaponStats } from './modules/player-stats'
import { GenericStatsResponse, OperatorStatsResponse, SeasonalStatsResponse, WeaponCategoryStatsResponse, WeaponStatsResponse } from './types'
import { R6StatsAPIConfiguration } from './types/api-config.type'
import { StatsLookup } from './types/stats-request.type'

const DEFAULT_OPTIONS = {
  baseUrl: 'https://api2.r6stats.com/public-api',
  userAgent: 'R6Stats API Application',
}

export class R6StatsAPI {
  private $axios: AxiosInstance
  private config: R6StatsAPIConfiguration

  constructor (config: R6StatsAPIConfiguration) {
    this.config = Object.assign({}, DEFAULT_OPTIONS, config)

    this.$axios = axios.create(this._baseConfig(this.config))
  }

  private async call <T>(opts: Object): Promise<T> {
    return this.$axios(opts).then(resp => resp.data)
  }

  async playerStats (params: StatsLookup): Promise<GenericStatsResponse> {
    return this.call<GenericStatsResponse>(playerStats(params))
  }

  async operatorStats (params: StatsLookup): Promise<OperatorStatsResponse> {
    return this.call<OperatorStatsResponse>(operatorStats(params))
  }

  async seasonalStats (params: StatsLookup): Promise<SeasonalStatsResponse> {
    return this.call<SeasonalStatsResponse>(seasonalStats(params))
  }

  async weaponStats (params: StatsLookup): Promise<WeaponStatsResponse> {
    return this.call<WeaponStatsResponse>(weaponStats(params))
  }

  async weaponCategoryStats (params: StatsLookup): Promise<WeaponCategoryStatsResponse> {
    return this.call<WeaponCategoryStatsResponse>(weaponCategoryStats(params))
  }

  private _baseConfig (config: R6StatsAPIConfiguration): object {
    return {
      baseURL: config.baseUrl,
      headers: {
        'User-Agent': config.userAgent,
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      }
    }
  }
}
