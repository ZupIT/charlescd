/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.domain.repository

import br.com.zup.charles.domain.GitConfiguration
import br.com.zup.charles.domain.Page
import br.com.zup.charles.domain.PageRequest
import java.util.*

interface GitConfigurationRepository {

    fun save(gitConfiguration: GitConfiguration): GitConfiguration

    fun findById(id: String): Optional<GitConfiguration>

    fun findByApplicationId(applicationId: String, pageRequest: PageRequest): Page<GitConfiguration>
}