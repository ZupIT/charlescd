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

import { CreateModuleDeploymentDto } from '../index'
import { Type } from 'class-transformer'
import {
  IsDefined,
  IsNotEmpty,
  Length,
  Matches,
  ValidateNested
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export abstract class CreateDeploymentRequestDto {

  @ApiProperty()
  @IsNotEmpty()
  public deploymentId!: string

  @ApiProperty()
  @Matches(/^[a-zA-Z0-9-]*$/)
  @Length(1, 59)
  public applicationName!: string

  @ApiProperty({ type: () => [CreateModuleDeploymentDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateModuleDeploymentDto)
  public modules!: CreateModuleDeploymentDto[]

  @ApiProperty()
  @IsNotEmpty()
  public authorId!: string

  @ApiProperty()
  @IsDefined()
  public description!: string

  @ApiProperty()
  @IsNotEmpty()
  public callbackUrl!: string

  @IsNotEmpty()
  public cdConfigurationId!: string
}
