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
import { CallbackTypeEnum } from '../enums/callback-type.enum'

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
    @Query('queueId') queueId: number,
    @Body() finishDeploymentDto: FinishDeploymentDto
  ): Promise<void> {
    if (finishDeploymentDto.callbackType === CallbackTypeEnum.DEPLOYMENT) {
      return await this.receiveDeploymentCallbackUsecase.execute(queueId, finishDeploymentDto)
    }
    if (finishDeploymentDto.callbackType === CallbackTypeEnum.ISTIO_DEPLOYMENT) {
      return await this.receiveIstioDeploymentCallbackUsecase.execute(queueId, finishDeploymentDto)
    }
    if (finishDeploymentDto.callbackType === CallbackTypeEnum.UNDEPLOYMENT) {
      return await this.receiveUndeploymentCallbackUsecase.execute(queueId, finishDeploymentDto)
    }
  }

}
