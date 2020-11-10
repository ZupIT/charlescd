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

package io.charlescd.moove.application.user.impl

import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.user.DeleteUserInteractor
import org.springframework.beans.factory.annotation.Value
import javax.inject.Named

@Named
class DeleteUserInteractorImpl(private val userService: UserService,
                               @Value("\${charles.internal.idm.enabled:true}") private val internalIdmEnabled: Boolean) : DeleteUserInteractor {

    override fun execute(id: String, authorization: String) {
        val user = userService.findByToken(authorization)
        if (user.root) {
            deleteUser(id)
            return
        }
        deleteUser(user.id)
    }

    private fun deleteUser(id: String) {
        userService.delete(id)
        if (internalIdmEnabled) {
            userService.deleteUserOnKeycloak(id)
        }
    }
}
