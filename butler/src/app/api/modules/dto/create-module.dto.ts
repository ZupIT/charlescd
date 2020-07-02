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

import { ModuleEntity } from '../entity'
import {
  IsDefined,
  IsNotEmpty,
  ValidateNested
} from 'class-validator'
import { CreateComponentDto } from './'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class CreateModuleDto {

    @ApiProperty()
    @IsNotEmpty()
    public readonly id: string

    @ApiProperty({ type: () => [CreateComponentDto] })
    @IsDefined()
    @ValidateNested({ each: true })
    @Type(() => CreateComponentDto)
    public readonly components: CreateComponentDto[]

    constructor(
      id: string,
      components: CreateComponentDto[]
    ) {
      this.id = id
      this.components = components
    }

    public toEntity(): ModuleEntity {
      return new ModuleEntity(
        this.id,
        this.components.map(component => component.toEntity())
      )
    }
}
