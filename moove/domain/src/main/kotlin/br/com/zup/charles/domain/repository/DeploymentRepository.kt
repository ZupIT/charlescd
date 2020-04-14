/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.domain.repository

import br.com.zup.charles.domain.Deployment
import br.com.zup.charles.domain.DeploymentStatusEnum
import java.util.*

interface DeploymentRepository {

    fun save(deployment: Deployment): Deployment

    fun update(deployment: Deployment) : Deployment

    fun findById(id: String): Optional<Deployment>

    fun updateStatus(id: String, status: DeploymentStatusEnum)

    fun findByCircleIdAndApplicationId(circleId: String, applicationId: String):  List<Deployment>

    fun find(circleId: String, status: DeploymentStatusEnum): Optional<Deployment>

    fun find(id: String, applicationId: String): Optional<Deployment>

}