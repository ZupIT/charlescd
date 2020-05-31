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

import com.fasterxml.jackson.annotation.JsonManagedReference
import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "deployments")
data class Deployment(

    @field:Id
    val id: String,

    @field:ManyToOne
    @field:JoinColumn(name = "user_id")
    val author: User,

    val createdAt: LocalDateTime,

    val deployedAt: LocalDateTime?,

    @Enumerated(EnumType.STRING)
    val status: DeploymentStatus,

    @field:ManyToOne
    @field:JoinColumn(name = "circle_id")
    val circle: Circle,

    @field:ManyToOne
    @field:JsonManagedReference
    @field:JoinColumn(name = "build_id")
    val build: Build,

    val workspaceId: String
)
