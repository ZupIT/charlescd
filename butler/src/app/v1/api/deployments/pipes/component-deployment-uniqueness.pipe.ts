/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  Injectable,
  PipeTransform, UnprocessableEntityException
} from '@nestjs/common'
import { CreateDeploymentRequestDto } from '../dto'

@Injectable()
export class ComponentDeploymentUniquenessPipe implements PipeTransform {

  public async transform(deploymentRequest: CreateDeploymentRequestDto): Promise<CreateDeploymentRequestDto> {
    const mapTimesComponent: Map<string, boolean> =  new Map()
    deploymentRequest.modules.forEach(
      module => module.components.forEach(
        component =>  this.verifyDuplicatedComponents(mapTimesComponent, component.componentId)
      )
    )
    return deploymentRequest
  }

  private verifyDuplicatedComponents(mapTimesComponent: Map<string, boolean>, componentId: string) {
    if (mapTimesComponent.get(componentId)) {
      throw new UnprocessableEntityException('Deployment should not have repeated components')
    } else {
      mapTimesComponent.set(componentId, true)
    }
    return mapTimesComponent
  }
}
