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

import { Module } from '@nestjs/common'
import { DeploymentsModule } from './deployments/deployments.module'
import { ModulesModule } from './modules/modules.module'
import { HealthcheckModule } from './healthcheck/healthcheck.module'
import { NotificationsModule } from './notifications/notitications.module'
import { ComponentsModule } from './components/components.module'
import { ConfigurationsModule } from './configurations/configurations.module'

@Module({
  imports: [
    DeploymentsModule,
    ModulesModule,
    HealthcheckModule,
    NotificationsModule,
    ComponentsModule,
    ConfigurationsModule
  ]
})
export class ApiModule {}
