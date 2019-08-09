import { Injectable } from '@nestjs/common'
import { IDeploymentConfiguration } from './interfaces'

@Injectable()
export class DeploymentConfigurationService {

  public async getConfiguration(): Promise<IDeploymentConfiguration> {
    return {
      account: 'k8s-account',
      pipelineName: 'darwin-content',
      applicationName: 'testelucas',
      appName: 'darwin-content',
      appNamespace: 'qa',
      imgUri: 'realwave-lab.azurecr.io/darwin-content',
      healthCheckPath: '/darwin-content/health',
      uri: {
        uriName: '/darwin-content'
      },
      appPort: '3000'
    }
  }
}
