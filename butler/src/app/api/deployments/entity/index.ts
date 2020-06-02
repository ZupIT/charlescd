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

import { DeploymentEntity } from './deployment.entity'
import { ModuleDeploymentEntity } from './module-deployment.entity'
import { ComponentDeploymentEntity } from './component-deployment.entity'
import { CircleDeploymentEntity } from './circle-deployment.entity'
import { QueuedDeploymentEntity } from './queued-deployment.entity'
import { UndeploymentEntity } from './undeployment.entity'
import { ModuleUndeploymentEntity } from './module-undeployment.entity'
import { ComponentUndeploymentEntity } from './component-undeployment.entity'
import { QueuedUndeploymentEntity } from './queued-undeployment.entity'
import { QueuedIstioDeploymentEntity } from './queued-istio-deployment.entity'

export {
  DeploymentEntity,
  ModuleDeploymentEntity,
  ComponentDeploymentEntity,
  CircleDeploymentEntity,
  QueuedDeploymentEntity,
  UndeploymentEntity,
  ModuleUndeploymentEntity,
  ComponentUndeploymentEntity,
  QueuedUndeploymentEntity,
  QueuedIstioDeploymentEntity,
}
