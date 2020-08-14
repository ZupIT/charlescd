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

import { Body, Controller, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { DeploymentNotificationRequest } from '../dto/deployment-notification-request.dto'
import { DeploymentEntityV2 as DeploymentEntity } from '../entity/deployment.entity'
import { NotificationUseCase } from '../use-cases/notification-use-case'

@Controller('/v2/notifications')
export class NotificationsController {

  constructor(
    private notificationUseCase: NotificationUseCase
  ) { }

  @Post('/deployment/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  public async receiveDeploymentCallback(
    @Param('id') id: string,
    @Body() notificationDto: DeploymentNotificationRequest,
  ): Promise<DeploymentEntity> {
    return this.notificationUseCase.handleCallback(id, notificationDto.status)
  }
}
