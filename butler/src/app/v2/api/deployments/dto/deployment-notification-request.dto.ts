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

import { IsEnum, IsNotEmpty } from 'class-validator'
import { DeploymentStatusEnum } from '../enums/deployment-status.enum'
import { ExecutionTypeEnum } from '../enums'
import { ApiProperty } from '@nestjs/swagger'
import { Log } from '../interfaces/log.interface'

export class DeploymentNotificationRequestDto {

  @ApiProperty({ enum: DeploymentStatusEnum })
  @IsNotEmpty()
  @IsEnum(DeploymentStatusEnum)
  public status: DeploymentStatusEnum

  @ApiProperty({ enum: ExecutionTypeEnum })
  @IsNotEmpty()
  public type: ExecutionTypeEnum

  @IsNotEmpty()
  public logs: Log[]

  constructor(
    status: DeploymentStatusEnum,
    type: ExecutionTypeEnum,
    logs: Log[]
  ) {
    this.status = status
    this.type = type
    this.logs = logs
  }
}
