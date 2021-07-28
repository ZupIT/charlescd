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

package io.charlescd.moove.legacy.repository.entity

import java.time.LocalDateTime
import javax.persistence.*
import org.hibernate.annotations.ColumnTransformer

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

    val workspaceId: String,

    @ColumnTransformer(
        read = "pgp_sym_decrypt(credentials::bytea, '8ea3688f-be19-4ae6-9c6c-d1a603602a2f', 'cipher-algo=aes256')",
        write = "pgp_sym_encrypt(?, '8ea3688f-be19-4ae6-9c6c-d1a603602a2f', 'cipher-algo=aes256')"
    )
    @Column(name = "credentials", columnDefinition = "bytea")
    @Convert(converter = GitConfigurationCredentialsConverter::class)
    val credentials: GitCredentials
)
