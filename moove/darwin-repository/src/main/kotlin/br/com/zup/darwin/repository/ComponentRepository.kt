/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.repository

import br.com.zup.darwin.entity.Component
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface ComponentRepository : JpaRepository<Component, String> {

    fun findByModuleId(moduleId: String): List<Component>

    fun findByIdAndApplicationId(id:String,applicationId:String) : Optional<Component>

}