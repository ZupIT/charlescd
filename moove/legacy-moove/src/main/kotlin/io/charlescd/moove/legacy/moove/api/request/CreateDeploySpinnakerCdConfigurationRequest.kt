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

package io.charlescd.moove.legacy.moove.api.request

import io.charlescd.moove.legacy.moove.request.configuration.CdTypeEnum

data class CreateDeploySpinnakerCdConfigurationRequest(
    val type: CdTypeEnum,
    val configurationData: CreateDeploySpinnakerCdConfigurationData,
    val name: String,
    val authorId: String
) : CreateDeployCdConfigurationRequest()

data class CreateDeploySpinnakerCdConfigurationData(
    val account: String,
    val gitAccount: String,
    val namespace: String,
    val url: String
)
