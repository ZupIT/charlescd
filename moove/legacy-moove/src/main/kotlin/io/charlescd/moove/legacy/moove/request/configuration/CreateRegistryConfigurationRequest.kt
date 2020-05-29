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

@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "provider"
)
@JsonSubTypes(
    JsonSubTypes.Type(value = CreateAzureRegistryConfigurationRequest::class, name = "AZURE"),
    JsonSubTypes.Type(value = CreateAWSRegistryConfigurationRequest::class, name = "AWS")
)
abstract class CreateRegistryConfigurationRequest(
    open val name: String,
    open val address: String,
    open val provider: CreateRegistryConfigurationProvider,
    open val authorId: String
)

data class CreateAzureRegistryConfigurationRequest(
    override val name: String,
    override val address: String,
    override val authorId: String,
    val username: String,
    val password: String
) : CreateRegistryConfigurationRequest(name, address, CreateRegistryConfigurationProvider.Azure, authorId)

data class CreateAWSRegistryConfigurationRequest(
    override val name: String,
    override val address: String,
    override val authorId: String,
    val accessKey: String,
    val secretKey: String,
    val region: String
) : CreateRegistryConfigurationRequest(name, address, CreateRegistryConfigurationProvider.AWS, authorId)

enum class CreateRegistryConfigurationProvider {
    AWS, Azure
}
