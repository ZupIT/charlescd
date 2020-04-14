/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.domain.repository

import br.com.zup.charles.domain.*
import java.util.*

interface BuildRepository {

    fun save(build: Build): Build

    fun updateStatus(id: String, status: BuildStatusEnum)

    fun findById(id: String): Optional<Build>

    fun find(id: String, applicationId: String): Optional<Build>

    fun find(tag: String?, status: BuildStatusEnum?, applicationId: String, page: PageRequest): Page<Build>

    fun delete(build: Build)

    fun saveArtifacts(artifacts: List<ArtifactSnapshot>)
}