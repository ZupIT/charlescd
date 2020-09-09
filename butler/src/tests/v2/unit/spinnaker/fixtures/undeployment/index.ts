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

import { completeSpinnakerUndeploymentPipeline } from './undeploy-complete-pipeline'
import { dummyVirtualserviceSpinnakerPipeline } from './dummy-virtualservice-pipeline'
import { undeploySameTagDiffCirclesUnused } from './undeploy-same-tag-diff-circles-unused'
import { undeployOneSameTagDiffCirclesUnused } from './undeploy-one-same-tag-diff-circles-unused'
import { undeployDiffSubsetsSameTag } from './undeploy-diff-subsets-same-tag'
import { hostnameGatewayUndeploymentPipeline } from './undeploy-hostname-gateway'

export {
  completeSpinnakerUndeploymentPipeline,
  dummyVirtualserviceSpinnakerPipeline,
  undeploySameTagDiffCirclesUnused,
  undeployOneSameTagDiffCirclesUnused,
  undeployDiffSubsetsSameTag,
  hostnameGatewayUndeploymentPipeline
}