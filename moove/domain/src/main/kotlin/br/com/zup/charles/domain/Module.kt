/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.domain

import java.time.LocalDateTime

data class Module(
    val id: String,
    val name: String,
    val gitRepositoryAddress: String,
    val createdAt: LocalDateTime,
    val helmRepository: String,
    val author: User,
    val labels: List<Label>,
    val gitConfiguration: GitConfiguration,
    val components: List<Component> = listOf(),
    val applicationId: String,
    val cdConfigurationId:String,
    val registryConfigurationId: String
) {
    fun findComponentsByIds(componentIds: List<String>): List<Component> {
        return this.components.filter { componentIds.contains(it.id) }
    }
}
