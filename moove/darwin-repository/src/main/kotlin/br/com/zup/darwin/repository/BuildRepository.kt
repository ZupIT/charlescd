/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.repository

import br.com.zup.darwin.entity.Build
import br.com.zup.darwin.entity.BuildStatus
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface BuildRepository : JpaRepository<Build, String> {

    fun findByTagIgnoreCaseContainingAndApplicationId(tagName: String, applicationId: String, page: Pageable): Page<Build>
    fun findByTagIgnoreCaseContainingAndStatusAndApplicationId(tagName: String, status: BuildStatus, applicationId: String, page: Pageable): Page<Build>
    fun findByStatusAndApplicationId(status: BuildStatus, applicationId: String, page: Pageable): Page<Build>

    fun findAllByApplicationId(applicationId: String, page: Pageable): Page<Build>

    fun findByIdAndApplicationId(id: String, applicationId: String): Optional<Build>

}
