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

import io.charlescd.moove.legacy.repository.entity.Circle
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface CircleRepository : JpaRepository<Circle, String> {

    @Query(
        nativeQuery = true,
        value = "SELECT DISTINCT C.* FROM CIRCLES C LEFT JOIN DEPLOYMENTS D  ON C.ID = D.CIRCLE_ID " +
                " WHERE D.CIRCLE_ID IS NULL OR C.ID NOT IN (" +
                " SELECT DISTINCT D.CIRCLE_ID FROM DEPLOYMENTS D WHERE D.STATUS IN ('DEPLOYING', 'DEPLOYED', 'UNDEPLOYING'))"
    )
    fun findInactiveCircles(page: Pageable): Page<Circle>

    @Query(
        nativeQuery = true,
        value = "SELECT DISTINCT C.* FROM CIRCLES C LEFT JOIN DEPLOYMENTS D  ON C.ID = D.CIRCLE_ID" +
                " WHERE LOWER(C.NAME) LIKE ('%' || LOWER(:name) || '%') " +
                " AND (D.CIRCLE_ID IS NULL OR C.ID NOT IN (" +
                " SELECT DISTINCT D.CIRCLE_ID FROM DEPLOYMENTS D WHERE D.STATUS IN ('DEPLOYING', 'DEPLOYED', 'UNDEPLOYING')))"
    )
    fun findInactiveCirclesByName(@Param("name") name: String, page: Pageable): Page<Circle>

    @Query(
        nativeQuery = true,
        value = "SELECT DISTINCT C.* FROM CIRCLES C INNER JOIN DEPLOYMENTS D ON C.ID = D.CIRCLE_ID " +
                " WHERE D.STATUS NOT IN ('NOT_DEPLOYED', 'DEPLOY_FAILED')"
    )
    fun findActiveCircles(page: Pageable): Page<Circle>

    @Query(
        nativeQuery = true,
        value = "SELECT DISTINCT C.* FROM CIRCLES C INNER JOIN DEPLOYMENTS D ON C.ID = D.CIRCLE_ID " +
                " WHERE D.STATUS NOT IN ('NOT_DEPLOYED', 'DEPLOY_FAILED') AND LOWER(C.NAME) LIKE ('%' || LOWER(:name) || '%')"
    )
    fun findActiveCirclesByName(@Param("name") name: String, page: Pageable): Page<Circle>
}
