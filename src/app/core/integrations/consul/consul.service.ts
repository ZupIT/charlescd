import * as consul from 'consul'
import { IConsulConnectionOptions, IConsulKV } from './interfaces'

export class ConsulService {

  private static readonly consulConnection: any = ConsulService.getConnection()

  public static async getKV(key: string): Promise<IConsulKV> {

    return new Promise((resolve, reject) => {
      ConsulService.consulConnection.kv.get(key, (err, item) => {
        err ? reject(err) : resolve(JSON.parse(item.Value))
      })
    })
  }

  private static getConnection() {
    return consul(
      ConsulService.getConnectionOptions()
    )
  }

  private static getConnectionOptions(): IConsulConnectionOptions {
    return {
      baseUrl: 'https://consul-darwin.apirealwave.io/v1' // process.env.CONSUL_HOST
    }
  }
}
