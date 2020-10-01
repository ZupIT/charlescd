import { Injectable } from '@nestjs/common'
import { ConsoleLoggerService } from '../../../../v1/core/logs/console'
import { Component, Deployment } from '../../../api/deployments/interfaces'
import { CdConnector } from '../interfaces/cd-connector.interface'
import { ConnectorConfiguration } from '../interfaces/connector-configuration.interface'
import { ConnectorResult, ConnectorResultError } from '../spinnaker/interfaces'

@Injectable()
export class OctopipeConnector implements CdConnector {

  constructor(
    private consoleLoggerService: ConsoleLoggerService
  ) {}

  public async createDeployment(
    deployment: Deployment,
    activeComponents: Component[],
    configuration: ConnectorConfiguration
  ): Promise<ConnectorResult | ConnectorResultError> {

    return { status: 'SUCCEEDED' }
  }

  public async createUndeployment(
    deployment: Deployment,
    activeComponents: Component[],
    configuration: ConnectorConfiguration
  ): Promise<ConnectorResult | ConnectorResultError> {

    return { status: 'SUCCEEDED' }
  }
}
