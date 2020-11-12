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

package io.charlescd.moove.legacy.moove.controller

import io.charlescd.moove.commons.representation.UserRepresentation
import io.charlescd.moove.legacy.moove.request.user.AddGroupsRequest
import io.charlescd.moove.legacy.moove.request.user.ResetPasswordRequest
import io.charlescd.moove.legacy.moove.request.user.UpdateUserRequest
import io.charlescd.moove.legacy.moove.service.KeycloakServiceLegacy
import io.charlescd.moove.legacy.moove.service.UserServiceLegacy
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import spock.lang.Specification

import java.time.LocalDateTime

class UserControllerUnitTest extends Specification {

    UserRepresentation representation = new UserRepresentation(
            "81861b6f-2b6e-44a1-a745-83e298a550c9",
            "John Doe",
            "email",
            "https://www.photos.com/johndoe",
            false,
            LocalDateTime.now()
    )
    UserServiceLegacy service = Mock(UserServiceLegacy)
    UserController controller

    def "setup"() {
        controller = new UserController(service)
    }

    def "should update user"() {
        given:
        def request = new UpdateUserRequest("John Doe", "email", "https://www.photos.com/johndoe")

        when:
        controller.update(representation.id, request)

        then:
        1 * service.update(representation.id, request)
        notThrown()
    }

    def "should delete user"() {
        when:
        def authorization = "Bearer dokqwodksoksd"
        controller.delete(representation.id, authorization)

        then:
        1 * service.delete('Bearer dokqwodksoksd', '81861b6f-2b6e-44a1-a745-83e298a550c9')
        notThrown()
    }
}
