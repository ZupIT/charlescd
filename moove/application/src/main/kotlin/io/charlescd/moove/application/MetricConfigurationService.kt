/*
 *
 *  * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *     http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *
 */

package io.charlescd.moove.application

import io.charlescd.moove.domain.MetricConfiguration
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.MetricConfigurationRepository
import javax.inject.Named

@Named
class MetricConfigurationService(
    private val metricConfigurationRepository: MetricConfigurationRepository
) {

    fun save(metricConfiguration: MetricConfiguration): MetricConfiguration {
        return metricConfigurationRepository.save(metricConfiguration)
    }

    fun find(id: String, workspaceId: String): MetricConfiguration {
        return metricConfigurationRepository.find(id, workspaceId).orElseThrow {
            NotFoundException("metricConfiguration", id)
        }
    }

    fun checkIfMetricConfigurationExists(id: String, workspaceId: String) {
        if (!metricConfigurationRepository.exists(id, workspaceId)) {
            throw NotFoundException("metricConfiguration", id)
        }
    }
}
