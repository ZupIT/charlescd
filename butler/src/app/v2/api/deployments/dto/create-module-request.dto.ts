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

import { Type } from 'class-transformer'
import { IsNotEmpty, IsString, IsUUID, Validate, ValidateNested } from 'class-validator'
import { ComponentUniqueProp } from '../validations/component-unique-by-name'
import { CreateComponentRequestDto } from './create-component-request.dto'

export class CreateModuleDeploymentDto {
  @IsUUID()
  @IsNotEmpty()
  public moduleId: string

  @IsString()
  @IsNotEmpty()
  public helmRepository: string

  @ValidateNested({ each: true })
  @Type(() => CreateComponentRequestDto)
  @Validate(ComponentUniqueProp, ['componentName'])
  public readonly components: CreateComponentRequestDto[]

  constructor(moduleId: string, helmRepository: string, components: CreateComponentRequestDto[]) {
    this.moduleId = moduleId
    this.helmRepository = helmRepository
    this.components = components
  }
}
