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

package io.charlescd.moove.domain

import io.charlescd.moove.domain.Circle
import io.charlescd.moove.domain.MatcherTypeEnum
import io.charlescd.moove.domain.User
import spock.lang.Specification

import java.time.LocalDateTime

class CircleTest extends Specification {

    def 'when trying to identify is circle is default, should do it successfully'(Circle circle, Boolean result) {
        expect:
        circle.isDefaultCircle() == result

        where:
        circle                | result
        getDummyCircle(true)  | true
        getDummyCircle(false) | false

    }

    private Circle getDummyCircle(Boolean isDefault) {
        def author = new User('7bdbca7a-a0dc-4721-a861-198b238c0e32', "charles", "charles@zup.com.br",
                "http://charles.com/dummy_photo.jpg", [], false, LocalDateTime.now())

        return new Circle('f8296cfc-6ae1-11ea-bc55-0242ac130003', "Default", 'f8296df6-6ae1-11ea-bc55-0242ac130003',
                author, LocalDateTime.now(), MatcherTypeEnum.SIMPLE_KV, null, null, null, isDefault, "1a58c78a-6acb-11ea-bc55-0242ac130003")
    }
}
