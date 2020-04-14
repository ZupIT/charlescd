/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.repository

import br.com.zup.darwin.entity.CredentialConfiguration
import br.com.zup.darwin.entity.CredentialConfigurationType
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface CredentialConfigurationRepository : JpaRepository<CredentialConfiguration, String> {

    fun findAllByApplicationId(applicationId: String): List<CredentialConfiguration>

    fun findByIdAndApplicationId(id: String, applicationId: String): Optional<CredentialConfiguration>

    fun findAllByTypeAndApplicationId(
        type: CredentialConfigurationType,
        applicationId: String
    ): List<CredentialConfiguration>

}