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

import { Body, Controller, HttpCode, Post, Query } from '@nestjs/common'
import { FinishDeploymentDto } from '../dto'
import {
  ReceiveDeploymentCallbackUsecase,
  ReceiveIstioDeploymentCallbackUsecase,
  ReceiveUndeploymentCallbackUsecase
} from '../use-cases'
import { NotificationTypeEnum } from '../enums/notification-type.enum';

@Controller('notifications')
export class NotificationsController {

  constructor(
    private readonly receiveDeploymentCallbackUsecase: ReceiveDeploymentCallbackUsecase,
    private readonly receiveIstioDeploymentCallbackUsecase: ReceiveIstioDeploymentCallbackUsecase,
    private readonly receiveUndeploymentCallbackUsecase: ReceiveUndeploymentCallbackUsecase
  ) {}

  @Post()
  @HttpCode(204)
  public async receiveDeploymentCallback(
    @Query('queuedDeploymentId') queuedDeploymentId: number,
    @Body() finishDeploymentDto: FinishDeploymentDto
  ): Promise<void> {
    if (finishDeploymentDto.type == NotificationTypeEnum.DEPLOYMENT) {
      return await this.receiveDeploymentCallbackUsecase.execute(queuedDeploymentId, finishDeploymentDto)
    }
    if (finishDeploymentDto.type == NotificationTypeEnum.ISTIO_DEPLOYMENT) {
      return await this.receiveIstioDeploymentCallbackUsecase.execute(queuedDeploymentId, finishDeploymentDto)
    }
    if (finishDeploymentDto.type == NotificationTypeEnum.UNDEPLOYMENT) {
      return await this.receiveUndeploymentCallbackUsecase.execute(queuedDeploymentId, finishDeploymentDto)
    }
  }

}
