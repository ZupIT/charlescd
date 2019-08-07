import { Injectable } from '@nestjs/common'
import {
  CreateDeploymentDto,
  ReadDeploymentDto,
  UpdateDeploymentDto
} from '../dto'

@Injectable()
export class DeploymentsService {

  public createDeployment(
    createDeploymentDto: CreateDeploymentDto
  ): ReadDeploymentDto {

  }

  public getDeployments(): ReadDeploymentDto[] {

  }

  public getDeploymentById(id: string): ReadDeploymentDto {

  }

  public updateDeployment(
    id: string,
    updateDeploymentDto: UpdateDeploymentDto
  ): ReadDeploymentDto {

  }

  public deleteDeployment(id: string) {

  }
}
