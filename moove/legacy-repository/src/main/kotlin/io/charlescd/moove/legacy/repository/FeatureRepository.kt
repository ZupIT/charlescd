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

package io.charlescd.moove.legacy.repository

import io.charlescd.moove.legacy.repository.entity.Feature
import java.util.*
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query

interface FeatureRepository : JpaRepository<Feature, String> {

    fun findAllByWorkspaceId(workspaceId: String, pageable: Pageable): Page<Feature>

    fun findByIdAndWorkspaceId(id: String, workspaceId: String): Optional<Feature>

    @Modifying
    @Query(
        value = "delete from features_modules where feature_id = :featureId and workspace_id = :workspaceId",
        nativeQuery = true
    )
    fun deleteModulesRelationship(featureId: String, workspaceId: String)
}
