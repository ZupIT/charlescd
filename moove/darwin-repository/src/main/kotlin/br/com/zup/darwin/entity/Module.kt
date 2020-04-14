/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.entity

import com.fasterxml.jackson.annotation.JsonBackReference
import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "modules")
data class Module(

    @field:Id
    val id: String,

    val name: String,

    val gitRepositoryAddress: String,

    val createdAt: LocalDateTime,

    val helmRepository: String,

    @field:ManyToOne
    @field:JoinColumn(name = "user_id")
    val author: User,

    @ManyToMany
    @JoinTable(
        name = "modules_labels",
        joinColumns = [JoinColumn(name = "module_id")],
        inverseJoinColumns = [JoinColumn(name = "label_id")]
    )
    val labels: List<Label>,

    @field:JsonBackReference
    @field:[OneToMany(mappedBy = "module")]
    val components: List<Component> = listOf(),

    val applicationId: String,

    @field:ManyToOne
    @field:JoinColumn(name = "git_configuration_id")
    val gitConfiguration: GitConfiguration,

    val cdConfigurationId: String,

    val registryConfigurationId: String
)
