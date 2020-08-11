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

import { NotificationsController } from '../../../app/v1/api/notifications/controller'
import {
  ReceiveDeploymentCallbackUsecase,
  ReceiveIstioDeploymentCallbackUsecase,
  ReceiveUndeploymentCallbackUsecase
} from '../../../app/v1/api/notifications/use-cases'
import { ReceiveDeploymentCallbackUseCaseStub } from '../../stubs/use-cases/receive-deployment-callback-usecase.stub'
import { FinishDeploymentDto } from '../../../app/v1/api/notifications/dto'
import { CallbackTypeEnum } from '../../../app/v1/api/notifications/enums/callback-type.enum'

describe('DeploymentsController', () => {

  let notificationsController: NotificationsController
  let receiveDeploymentCallbackUseCase: ReceiveDeploymentCallbackUsecase
  let receiveIstioDeploymentCallbackUseCase: ReceiveIstioDeploymentCallbackUsecase
  let receiveUndeploymentCallbackUsecase: ReceiveUndeploymentCallbackUsecase
  beforeEach(async() => {

    receiveDeploymentCallbackUseCase = new ReceiveDeploymentCallbackUseCaseStub() as unknown as ReceiveDeploymentCallbackUsecase
    receiveIstioDeploymentCallbackUseCase = new ReceiveDeploymentCallbackUseCaseStub() as unknown as ReceiveIstioDeploymentCallbackUsecase
    receiveUndeploymentCallbackUsecase = new ReceiveDeploymentCallbackUseCaseStub() as unknown as ReceiveUndeploymentCallbackUsecase
    notificationsController = new NotificationsController(
      receiveDeploymentCallbackUseCase,
      receiveIstioDeploymentCallbackUseCase,
      receiveUndeploymentCallbackUsecase)
  })

  describe('execute', () => {
    it('should call the deployment callback usecase', async() => {

      const finishDeploymentDto = new FinishDeploymentDto('SUCCEEDED', CallbackTypeEnum.DEPLOYMENT)

      const spyUseCase = jest.spyOn(receiveDeploymentCallbackUseCase, 'execute')
      await notificationsController.receiveDeploymentCallback(123, finishDeploymentDto)
      expect(spyUseCase).toBeCalled()
    })

    it('should call the undeployment callback usecase', async() => {

      const finishDeploymentDto = new FinishDeploymentDto('SUCCEEDED', CallbackTypeEnum.UNDEPLOYMENT)

      const spyUseCase = jest.spyOn(receiveUndeploymentCallbackUsecase, 'execute')
      await notificationsController.receiveDeploymentCallback(123, finishDeploymentDto)
      expect(spyUseCase).toBeCalled()
    })

    it('should call the istio-deployment callback usecase', async() => {

      const finishDeploymentDto = new FinishDeploymentDto('SUCCEEDED', CallbackTypeEnum.ISTIO_DEPLOYMENT)

      const spyUseCase = jest.spyOn(receiveIstioDeploymentCallbackUseCase, 'execute')
      await notificationsController.receiveDeploymentCallback(123, finishDeploymentDto)
      expect(spyUseCase).toBeCalled()
    })
  })

})
