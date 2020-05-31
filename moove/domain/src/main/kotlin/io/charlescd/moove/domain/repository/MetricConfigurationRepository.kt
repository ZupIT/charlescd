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

package io.charlescd.moove.domain.repository

import io.charlescd.moove.domain.MetricConfiguration
import java.util.*

interface MetricConfigurationRepository {

    fun save(metricConfiguration: MetricConfiguration): MetricConfiguration

    fun find(metricConfigurationId: String, workspaceId: String): Optional<MetricConfiguration>

    fun exists(metricConfigurationId: String, workspaceId: String): Boolean

    fun findByWorkspaceId(workspaceId: String): Optional<MetricConfiguration>

}
