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

import { IsUUID, IsNotEmpty, IsString, Matches, Length, ValidateIf } from 'class-validator'
import { ComponentEntityV2 as ComponentEntity } from '../entity/component.entity'
import { ApiProperty } from '@nestjs/swagger'

export class CreateComponentRequestDto {

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  public componentId: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9][a-zA-Z0-9-.:/]*[a-zA-Z0-9]$/)
  @Length(1, 253)
  public buildImageUrl: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]*$/)
  public buildImageTag: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public componentName: string

  @ApiProperty()
  @ValidateIf((obj, value) => { return value })
  @IsString()
  @IsNotEmpty()
  public readonly hostValue!: string | undefined

  @ApiProperty()
  @ValidateIf((obj, value) => { return value })
  @IsString()
  @IsNotEmpty()
  public readonly gatewayName!: string | undefined

  constructor(
    componentId: string,
    buildImageUrl: string,
    buildImageTag: string,
    componentName: string,
    hostValue: string | undefined,
    gatewayName: string | undefined
  ) {
    this.componentId = componentId
    this.buildImageUrl = buildImageUrl
    this.buildImageTag = buildImageTag
    this.componentName = componentName
    this.hostValue = hostValue
    this.gatewayName = gatewayName
  }

  public toEntity(helmRepositoryUrl: string): ComponentEntity {
    return new ComponentEntity(
      helmRepositoryUrl,
      this.buildImageTag,
      this.buildImageUrl,
      this.componentName,
      this.componentId,
      this.hostValue ? this.hostValue : null,
      this.gatewayName ? this.gatewayName : null
    )
  }
}
