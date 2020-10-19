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

import { ComponentDeploymentEntity } from '../../entity'
import { IsNotEmpty, ValidateIf } from 'class-validator'
import { ComponentEntity } from '../../../components/entity'
import { ApiProperty } from '@nestjs/swagger'

export class CreateComponentDeploymentDto {

  @ApiProperty()
  @IsNotEmpty()
  public readonly componentId!: string

  @ApiProperty()
  @IsNotEmpty()
  public readonly componentName!: string

  @ApiProperty()
  @IsNotEmpty()
  public readonly buildImageUrl!: string

  @ApiProperty()
  @IsNotEmpty()
  public readonly buildImageTag!: string

  @ApiProperty()
  @ValidateIf((obj, value) => { return value })
  public readonly hostValue!: string

  @ApiProperty()
  @ValidateIf((obj, value) => { return value })
  public readonly gatewayName!: string

  public toComponentModuleEntity(): ComponentDeploymentEntity {

    return new ComponentDeploymentEntity(
      this.componentId,
      this.componentName,
      this.buildImageUrl,
      this.buildImageTag
    )
  }

  public toComponentEntity(): ComponentEntity {
    return new ComponentEntity(
      this.componentId, 
      this.hostValue, 
      this.gatewayName
    )
  }
}
