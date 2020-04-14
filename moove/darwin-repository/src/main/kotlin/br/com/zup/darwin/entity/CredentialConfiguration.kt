/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.entity

import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "credential_configurations")
data class CredentialConfiguration(

    @field:Id
    val id: String,

    val name: String,

    @Enumerated(EnumType.STRING)
    val type: CredentialConfigurationType,

    val createdAt: LocalDateTime = LocalDateTime.now(),

    @field:ManyToOne
    @JoinColumn(name = "user_id")
    val author: User,

    val applicationId: String
)

enum class CredentialConfigurationType {
    GIT, REGISTRY, K8S
}
