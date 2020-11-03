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

import { ComponentEntity } from '../../../../app/v1/api/components/entity'
import { CircleDeploymentEntity, ComponentDeploymentEntity } from '../../../../app/v1/api/deployments/entity'

describe('ComponentEntity test', () => {
  it('should create the right version name with the first 8 chars of circle id', () => {
    const componentEntity = new ComponentEntity(
      'component-id',
      'host-value',
      'gateway-name'
    )
    const componentDeploymentEntity = new ComponentDeploymentEntity(
      'component-id',
      'component-name',
      'build-image-url',
      'build-image-tag'
    )
    const circle = new CircleDeploymentEntity(
      '0e19100a-448d-4aa4-8fa0-7cf84e91ae10'
    )
    componentEntity.setPipelineCircle(circle, componentDeploymentEntity)
    expect(componentEntity.pipelineOptions.pipelineVersions[0].version).toBe('build-image-tag')
    expect(componentEntity.pipelineOptions.pipelineCircles[0].destination.version).toBe('build-image-tag')

  })
  it('should create the right version name with the first 8 chars of default circle id', () => {
    const componentEntity = new ComponentEntity(
      'component-id',
      'host-value',
      'gateway-name'
    )
    const componentDeploymentEntity = new ComponentDeploymentEntity(
      'component-id',
      'component-name',
      'build-image-url',
      'build-image-tag'
    )

    componentEntity.setPipelineDefaultCircle(componentDeploymentEntity)

    expect(componentEntity.pipelineOptions.pipelineVersions[0].version).toBe('build-image-tag')
    expect(componentEntity.pipelineOptions.pipelineCircles[0].destination.version).toBe('build-image-tag')

  })
})
