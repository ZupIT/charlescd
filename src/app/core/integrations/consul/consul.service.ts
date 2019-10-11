import * as consul from 'consul'

export class ConsulService {

  private static readonly consulConnection: any = ConsulService.getConnection()

  public static async getKV(key: string): Promise<any> {

    return new Promise((resolve, reject) => {
      ConsulService.consulConnection.kv.get(key, (err, item) => {
        err ? reject(err) : resolve(JSON.parse(item.Value))
      })
    })
  }

  private static getConnection(): any {
    return consul(
      ConsulService.getConnectionOptions()
    )
  }

  private static getConnectionOptions(): any {
    return {
      baseUrl: 'https://consul-darwin.apirealwave.io/v1' // process.env.CONSUL_HOST
    }
  }
}
