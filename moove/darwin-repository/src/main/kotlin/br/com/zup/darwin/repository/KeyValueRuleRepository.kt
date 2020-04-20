/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.repository

import br.com.zup.darwin.entity.Circle
import br.com.zup.darwin.entity.KeyValueRule
import org.springframework.data.jpa.repository.JpaRepository

interface KeyValueRuleRepository : JpaRepository<KeyValueRule, String> {

    fun findByCircle(circle: Circle): List<KeyValueRule>

}