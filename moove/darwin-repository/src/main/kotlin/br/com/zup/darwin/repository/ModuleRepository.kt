/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.repository

import br.com.zup.darwin.entity.Module
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.util.*

interface ModuleRepository : JpaRepository<Module, String> {

    fun findByIdAndApplicationId(id: String, applicationId: String): Optional<Module>

    fun findAllByApplicationId(applicationId: String, pageable: Pageable): Page<Module>

    fun findByNameAndApplicationIdIgnoreCaseContaining(
        name: String,
        applicationId: String,
        page: Pageable
    ): Page<Module>

    fun findAllByIdAndApplicationId(ids: List<String>, applicationId: String): List<Module>

    @Query(nativeQuery = true, value = "SELECT DISTINCT (m.*) FROM modules m " +
            " INNER JOIN features_modules fm ON fm.module_id  = m.id " +
            " INNER JOIN features f ON f.id  = fm.feature_id  " +
            " INNER JOIN builds_features bf ON bf.feature_id  = f.id " +
            " INNER JOIN builds b ON b.id = bf.build_id " +
            " INNER JOIN deployments d ON d.build_id = b.id " +
            " WHERE d.circle_id = :circleId ")
    fun findAllModulesDeployedAtCircle(circleId: String): Optional<List<Module>>

}
