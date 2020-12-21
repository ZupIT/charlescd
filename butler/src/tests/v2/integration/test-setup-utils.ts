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

import { INestApplication } from '@nestjs/common'
import { TestingModuleBuilder } from '@nestjs/testing'
import { AppConstants } from '../../../app/v2/core/constants'
import { EntityNotFoundExceptionFilter } from '../../../app/v2/core/filters/entity-not-found-exception.filter'
import { ConsoleLoggerService } from '../../../app/v2/core/logs/console'
import { K8sClient } from '../../../app/v2/core/integrations/k8s/client'

/**
 * Since we are not running integration tests inside a Kubernetes cluster, the K8sClient
 * class and some of the existing tests will always fail, and because of that, we are mo-
 * cking this class for the entirety of the test context.
 */
const K8sClientStub = {
  applyDeploymentCustomResource: async() => {
    return Promise.resolve()
  },

  applyUndeploymentCustomResource: async() => {
    return Promise.resolve()
  },

  applyRoutingCustomResource: async() => {
    return Promise.resolve()
  }
}

export class TestSetupUtils {

  public static async createApplication(module: TestingModuleBuilder): Promise<INestApplication> {
    try {
      const compiledModule = await module.overrideProvider(K8sClient).useValue(K8sClientStub).compile()
      const app: INestApplication = compiledModule.createNestApplication()
      const consoleLoggerService: ConsoleLoggerService = app.get<ConsoleLoggerService>(ConsoleLoggerService)

      app.useGlobalFilters(new EntityNotFoundExceptionFilter(consoleLoggerService))
      app.enableShutdownHooks()
      await app.init()
      return app
    } catch (error) {
      throw new Error(`ERROR: Could not boot nestjs application: ${error}`)
    }
  }

  public static seApplicationConstants(): void {
    AppConstants.ENCRYPTION_KEY = 'jest-test-aes-key'
  }
}
