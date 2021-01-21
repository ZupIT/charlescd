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

package io.charlescd.moove.application.user.impl

import io.charlescd.moove.application.ResourcePageResponse
import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.user.FindAllUsersInteractor
import io.charlescd.moove.application.user.response.SimpleUserResponse
import io.charlescd.moove.domain.Page
import io.charlescd.moove.domain.PageRequest
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.exceptions.ForbiddenException
import javax.inject.Inject
import javax.inject.Named

@Named
class FindAllUsersInteractorImpl @Inject constructor(
    private val userService: UserService
) : FindAllUsersInteractor {

    override fun execute(name: String?, email: String?, authorization: String, pageRequest: PageRequest): ResourcePageResponse<SimpleUserResponse> {
        val user = userService.findByAuthorizationToken(authorization)
        if (user.root) {
            return convert(userService.findAll(name, email, pageRequest))
        }
        throw ForbiddenException()
    }

    private fun convert(page: Page<User>): ResourcePageResponse<SimpleUserResponse> {
        return ResourcePageResponse(
            content = page.content.map { SimpleUserResponse.from(it) },
            page = page.pageNumber,
            size = page.size(),
            isLast = page.isLast(),
            totalPages = page.totalPages()
        )
    }
}
