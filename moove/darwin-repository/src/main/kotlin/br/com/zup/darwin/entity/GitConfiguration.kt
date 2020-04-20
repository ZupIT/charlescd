/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.entity

import org.hibernate.annotations.ColumnTransformer
import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "git_configurations")
class GitConfiguration(

    @field:Id
    val id: String,

    val name: String,

    val createdAt: LocalDateTime = LocalDateTime.now(),

    @field:ManyToOne
    @JoinColumn(name = "user_id")
    val author: User,

    val applicationId: String,

    @ColumnTransformer(
        read = "pgp_sym_decrypt(credentials::bytea, '8ea3688f-be19-4ae6-9c6c-d1a603602a2f', 'cipher-algo=aes256')",
        write = "pgp_sym_encrypt(?, '8ea3688f-be19-4ae6-9c6c-d1a603602a2f', 'cipher-algo=aes256')"
    )
    @Column(name = "credentials", columnDefinition = "bytea")
    @Convert(converter = GitConfigurationCredentialsConverter::class)
    val credentials: GitCredentials
)