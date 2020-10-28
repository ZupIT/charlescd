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

import { IsBooleanString, IsOptional, IsInt, Min } from 'class-validator'
import { Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class ExecutionQuery {

  @ApiProperty()
  @IsInt()
  @Min(1)
  @IsOptional()
  @Transform(size => parseInt(size), { toClassOnly: true })
  public size: number

  @ApiProperty()
  @IsInt()
  @Min(0)
  @IsOptional()
  @Transform(page => parseInt(page), { toClassOnly: true })
  public page: number

  @ApiProperty()
  @IsBooleanString()
  public active: boolean

  constructor(size: number, page: number, active: boolean) {
    this.size = size
    this.page = page
    this.active = active
  }
}
