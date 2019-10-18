import * as consul from 'consul'
import { IConsulConnectionOptions, IConsulKV } from './interfaces'
import { AppConstants } from '../../constants'

export class ConsulService {

  private static readonly consulConnection = ConsulService.getConnection()

  public static async getAppConfiguration(): Promise<IConsulKV> {

    return AppConstants.NODE_ENV === 'dev' ?
      ConsulService.getDefaultConfiguration() :
      await ConsulService.getKV(AppConstants.CONSUL_KEY_PATH)
  }

  private static async getKV(key: string): Promise<IConsulKV> {

    return new Promise((resolve, reject) => {
      ConsulService.consulConnection.kv.get(key, (err, item) => {
        err ? reject(err) : resolve(JSON.parse(item.Value))
      })
    })
  }

  private static getDefaultConfiguration(): IConsulKV {
    return AppConstants.CONSUL_DEFAULT_VALUES
  }

  private static getConnection() {
    return consul(
      ConsulService.getConnectionOptions()
    )
  }

  private static getConnectionOptions(): IConsulConnectionOptions {
    return {
      host: AppConstants.CONSUL_HOST
    }
  }
}
