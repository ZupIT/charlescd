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

package io.charlescd.moove.domain

abstract class RegistryConfiguration(
    open val name: String,
    open val address: String,
    open val provider: RegistryConfigurationProviderEnum,
    open val hostname: String,
    open val author: User,
    open val workspace: Workspace
)

data class AzureRegistryConfiguration(
    override val name: String,
    override val address: String,
    override val author: User,
    override val hostname: String,
    override val workspace: Workspace,
    val username: String,
    val password: String
) : RegistryConfiguration(name, address, RegistryConfigurationProviderEnum.Azure, hostname, author, workspace)

data class AWSRegistryConfiguration(
    override val name: String,
    override val address: String,
    override val author: User,
    override val hostname: String,
    override val workspace: Workspace,
    val accessKey: String,
    val secretKey: String,
    val region: String
) : RegistryConfiguration(name, address, RegistryConfigurationProviderEnum.AWS, hostname, author, workspace)

data class GCPRegistryConfiguration(
    override val name: String,
    override val address: String,
    override val author: User,
    override val hostname: String,
    override val workspace: Workspace,
    val organization: String,
    val jsonKey: String
) : RegistryConfiguration(name, address, RegistryConfigurationProviderEnum.GCP, hostname, author, workspace)

enum class RegistryConfigurationProviderEnum {
    AWS, Azure, GCP
}
