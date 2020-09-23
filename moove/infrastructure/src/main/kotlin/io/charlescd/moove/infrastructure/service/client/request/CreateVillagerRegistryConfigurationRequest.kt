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

package io.charlescd.moove.infrastructure.service.client.request

data class CreateVillagerRegistryConfigurationRequest(
    val name: String,
    val address: String,
    val provider: CreateVillagerRegistryConfigurationProvider,
    val username: String? = null,
    val password: String? = null,
    val accessKey: String? = null,
    val secretKey: String? = null,
    val region: String? = null,
    val authorId: String,
    val organization: String? = null,
    val jsonKey: String? = null
)

enum class CreateVillagerRegistryConfigurationProvider {
    AWS, Azure, GCP
}
