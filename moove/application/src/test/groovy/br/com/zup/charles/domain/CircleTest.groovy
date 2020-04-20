/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.domain

import spock.lang.Specification

import java.time.LocalDateTime

class CircleTest extends Specification {

    def 'when trying to identify is circle is default, should do it successfully'(Circle circle, Boolean result) {
        expect:
        circle.isDefault() == result

        where:
        circle                        | result
        getDummyCircle("Default")     | true
        getDummyCircle("DefaULT")     | true
        getDummyCircle("DEFAULT")     | true
        getDummyCircle("DeFaUlT")     | true
        getDummyCircle("Circle name") | false

    }

    private Circle getDummyCircle(String name) {
        def author = new User('7bdbca7a-a0dc-4721-a861-198b238c0e32', "charles", "charles@zup.com.br",
                "http://charles.com/dummy_photo.jpg", [], LocalDateTime.now())

        return new Circle('f8296cfc-6ae1-11ea-bc55-0242ac130003', name, 'f8296df6-6ae1-11ea-bc55-0242ac130003',
                author, LocalDateTime.now(), MatcherTypeEnum.SIMPLE_KV, null, null, null)
    }
}
