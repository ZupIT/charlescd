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

package io.charlescd.moove.legacy.moove.request.configuration

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import javax.validation.constraints.Size

@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "provider"
)
@JsonSubTypes(
    JsonSubTypes.Type(value = CreateAzureRegistryConfigurationRequest::class, name = "AZURE"),
    JsonSubTypes.Type(value = CreateAWSRegistryConfigurationRequest::class, name = "AWS"),
    JsonSubTypes.Type(value = CreateGCPRegistryConfigurationRequest::class, name = "GCP"),
    JsonSubTypes.Type(value = CreateDockerHubRegistryConfigurationRequest::class, name = "DOCKER_HUB"),
    JsonSubTypes.Type(value = CreateHarborRegistryConfigurationRequest::class, name = "HARBOR")
)
abstract class CreateRegistryConfigurationRequest(
    @field:Size(max = 64)
    open val name: String,
    @field:Size(max = 2048)
    open val address: String,
    open val provider: CreateRegistryConfigurationProvider
)

data class CreateAzureRegistryConfigurationRequest(
    override val name: String,
    override val address: String,
    @field:Size(max = 64)
    val username: String,
    @field:Size(max = 100)
    val password: String
) : CreateRegistryConfigurationRequest(name, address, CreateRegistryConfigurationProvider.Azure)

data class CreateAWSRegistryConfigurationRequest(
    override val name: String,
    override val address: String,
    @field:Size(max = 256)
    val accessKey: String?,
    @field:Size(max = 256)
    val secretKey: String?,
    @field:Size(max = 64)
    val region: String
) : CreateRegistryConfigurationRequest(name, address, CreateRegistryConfigurationProvider.AWS)

data class CreateGCPRegistryConfigurationRequest(
    override val name: String,
    override val address: String,
    @field:Size(max = 256)
    val organization: String,
    val jsonKey: String
) : CreateRegistryConfigurationRequest(name, address, CreateRegistryConfigurationProvider.GCP)

data class CreateDockerHubRegistryConfigurationRequest(
    override val name: String,
    override val address: String,
    @field:Size(max = 64)
    val username: String,
    @field:Size(max = 100)
    val password: String
) : CreateRegistryConfigurationRequest(name, address, CreateRegistryConfigurationProvider.DOCKER_HUB)

data class CreateHarborRegistryConfigurationRequest(
    override val name: String,
    override val address: String,
    val username: String,
    val password: String
) : CreateRegistryConfigurationRequest(name, address, CreateRegistryConfigurationProvider.HARBOR)

enum class CreateRegistryConfigurationProvider {
    AWS, Azure, GCP, DOCKER_HUB, HARBOR
}
