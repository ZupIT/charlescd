import { Injectable } from '@nestjs/common'
import { CreateDeploymentRequest, DeploymentRepresentation, UpdateDeploymentRequest } from '../interfaces'

@Injectable()
export class DeploymentsService {

  public createDeployment(
    createDeploymentRequest: CreateDeploymentRequest
  ): DeploymentRepresentation {

  }

  public getDeployments(): DeploymentRepresentation[] {

  }

  public getDeploymentById(id: string): DeploymentRepresentation {

  }

  public updateDeployment(
    id: string,
    updateDeploymentRequest: UpdateDeploymentRequest
  ): DeploymentRepresentation {

  }

  public deleteDeployment(id: string) {

  }
}
