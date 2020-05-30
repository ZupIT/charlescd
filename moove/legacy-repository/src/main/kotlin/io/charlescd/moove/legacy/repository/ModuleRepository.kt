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

import io.charlescd.moove.legacy.repository.entity.Module
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.util.*

interface ModuleRepository : JpaRepository<Module, String> {

    fun findByIdAndWorkspaceId(id: String, workspaceId: String): Optional<Module>

    fun findAllByWorkspaceId(workspaceId: String, pageable: Pageable): Page<Module>

    fun findByNameAndWorkspaceIdIgnoreCaseContaining(
        name: String,
        workspaceId: String,
        page: Pageable
    ): Page<Module>

    fun findAllByIdAndWorkspaceId(ids: List<String>, workspaceId: String): List<Module>

    @Query(
        nativeQuery = true, value = "SELECT DISTINCT (m.*) FROM modules m " +
                " INNER JOIN features_modules fm ON fm.module_id  = m.id " +
                " INNER JOIN features f ON f.id  = fm.feature_id  " +
                " INNER JOIN builds_features bf ON bf.feature_id  = f.id " +
                " INNER JOIN builds b ON b.id = bf.build_id " +
                " INNER JOIN deployments d ON d.build_id = b.id " +
                " WHERE d.circle_id = :circleId "
    )
    fun findAllModulesDeployedAtCircle(circleId: String): Optional<List<Module>>

}
