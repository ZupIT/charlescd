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

package io.charlescd.circlematcher.handler

import io.charlescd.circlematcher.domain.exception.BusinessException
import io.charlescd.circlematcher.domain.exception.MatcherErrorCode
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.validation.FieldError
import org.springframework.web.bind.MethodArgumentNotValidException
import spock.lang.Specification

import java.time.LocalDateTime

class DefaultErrorResponseTest extends Specification {


    def "should return the correct message from business exception method"() {
        when:
        def defaultErrorResponse = new DefaultErrorResponse(
                UUID.randomUUID().toString(),
                [],
                "title",
                "details",
                "400",
                new HashMap<String, String>(),
                new HashMap<String, String>()
        )
        then:
        assert defaultErrorResponse.links == []
        assert defaultErrorResponse.id instanceof String
        assert defaultErrorResponse.details == 'details'
        assert defaultErrorResponse.title == 'title'
        assert defaultErrorResponse.status == "400"
        assert defaultErrorResponse.meta.size() == 0
        assert defaultErrorResponse.source.size() == 0
    }


}
