/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.repository

import br.com.zup.darwin.entity.Circle
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface CircleRepository : JpaRepository<Circle, String> {

    @Query(nativeQuery = true, value = "SELECT DISTINCT C.* FROM CIRCLES C LEFT JOIN DEPLOYMENTS D  ON C.ID = D.CIRCLE_ID " +
            " WHERE D.CIRCLE_ID IS NULL OR C.ID NOT IN (" +
            " SELECT DISTINCT D.CIRCLE_ID FROM DEPLOYMENTS D WHERE D.STATUS IN ('DEPLOYING', 'DEPLOYED', 'UNDEPLOYING'))")
    fun findInactiveCircles(page: Pageable): Page<Circle>

    @Query(nativeQuery = true, value = "SELECT DISTINCT C.* FROM CIRCLES C LEFT JOIN DEPLOYMENTS D  ON C.ID = D.CIRCLE_ID" +
            " WHERE LOWER(C.NAME) LIKE ('%' || LOWER(:name) || '%') " +
            " AND (D.CIRCLE_ID IS NULL OR C.ID NOT IN (" +
            " SELECT DISTINCT D.CIRCLE_ID FROM DEPLOYMENTS D WHERE D.STATUS IN ('DEPLOYING', 'DEPLOYED', 'UNDEPLOYING')))")
    fun findInactiveCirclesByName(@Param("name") name: String, page: Pageable): Page<Circle>

    @Query(nativeQuery = true, value = "SELECT DISTINCT C.* FROM CIRCLES C INNER JOIN DEPLOYMENTS D ON C.ID = D.CIRCLE_ID " +
            " WHERE D.STATUS NOT IN ('NOT_DEPLOYED', 'DEPLOY_FAILED')")
    fun findActiveCircles(page: Pageable): Page<Circle>

    @Query(nativeQuery = true, value = "SELECT DISTINCT C.* FROM CIRCLES C INNER JOIN DEPLOYMENTS D ON C.ID = D.CIRCLE_ID " +
            " WHERE D.STATUS NOT IN ('NOT_DEPLOYED', 'DEPLOY_FAILED') AND LOWER(C.NAME) LIKE ('%' || LOWER(:name) || '%')")
    fun findActiveCirclesByName(@Param("name") name: String, page: Pageable): Page<Circle>

}