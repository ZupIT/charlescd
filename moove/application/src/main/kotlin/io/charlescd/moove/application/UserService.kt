/*
 *
 *  * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *     http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *
 */

package io.charlescd.moove.application

import io.charlescd.moove.domain.Page
import io.charlescd.moove.domain.PageRequest
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.UserRepository
import javax.inject.Named

@Named
class UserService(private val userRepository: UserRepository) {

    fun find(userId: String): User {
        return this.userRepository.findById(
            userId
        ).orElseThrow {
            NotFoundException("user", userId)
        }
    }

    fun findAll(name: String?, email: String?, pageRequest: PageRequest): Page<User> {
        return this.userRepository.findAll(name, email, pageRequest)
    }

    fun findByEmail(email: String): User {
        return this.userRepository.findByEmail(
            email
        ).orElseThrow {
            NotFoundException("user", email)
        }
    }
}
