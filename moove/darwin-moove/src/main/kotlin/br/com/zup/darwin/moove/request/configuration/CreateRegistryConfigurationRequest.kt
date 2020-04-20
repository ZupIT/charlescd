/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.request.configuration

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo

@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "provider"
)
@JsonSubTypes(
    JsonSubTypes.Type(value = CreateAzureRegistryConfigurationRequest::class, name = "Azure"),
    JsonSubTypes.Type(value = CreateAWSRegistryConfigurationRequest::class, name = "AWS")
)
abstract class CreateRegistryConfigurationRequest(
    open val name: String,
    open val address: String,
    open val provider: CreateRegistryConfigurationProvider,
    open val authorId: String
)

data class CreateAzureRegistryConfigurationRequest (
    override val name: String,
    override val address: String,
    override val authorId: String,
    val username: String,
    val password: String
) : CreateRegistryConfigurationRequest(name, address, CreateRegistryConfigurationProvider.Azure, authorId)

data class CreateAWSRegistryConfigurationRequest (
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