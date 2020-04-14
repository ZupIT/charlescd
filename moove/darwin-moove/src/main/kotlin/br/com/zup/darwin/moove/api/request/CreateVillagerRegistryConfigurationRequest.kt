/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.api.request

data class CreateVillagerRegistryConfigurationRequest(
    val name: String,
    val address: String,
    val provider: CreateVillagerRegistryConfigurationProvider,
    val username: String? = null,
    val password: String? = null,
    val accessKey: String? = null,
    val secretKey: String? = null,
    val region: String? = null,
    val authorId: String
)

enum class CreateVillagerRegistryConfigurationProvider {
    AWS, Azure
}