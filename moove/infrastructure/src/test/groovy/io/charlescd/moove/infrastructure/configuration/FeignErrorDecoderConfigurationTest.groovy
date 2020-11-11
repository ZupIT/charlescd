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

package io.charlescd.moove.infrastructure.configuration

import feign.Response
import feign.codec.ErrorDecoder
import io.charlescd.moove.domain.exceptions.BusinessException
import org.springframework.test.util.ReflectionTestUtils
import spock.lang.Specification


class FeignErrorDecoderConfigurationTest extends Specification {
    FeignErrorDecoderConfiguration feignErrorDecoderConfiguration
    ErrorDecoder errorDecoder

    def "should return illegal argument exception when status is 400"() {
        given:
        feignErrorDecoderConfiguration = new FeignErrorDecoderConfiguration();
        errorDecoder = feignErrorDecoderConfiguration.errorDecoder()

        def response = GroovyMock(Response)
        ReflectionTestUtils.setField(response, "status", 400)
        ReflectionTestUtils.setField(response, "reason",'Error')
        when:
        def exception = errorDecoder.decode("methodkey", response)
        then:
        assert exception instanceof IllegalArgumentException
    }

    def "should return business exception when status is 422"() {
        given:
        feignErrorDecoderConfiguration = new FeignErrorDecoderConfiguration();
        errorDecoder = feignErrorDecoderConfiguration.errorDecoder()

        def response = GroovyMock(Response)
        ReflectionTestUtils.setField(response,"reason", 'Error')
        ReflectionTestUtils.setField(response,"status", 422)
        when:
        def exception = errorDecoder.decode("methodkey", response)
        then:
        assert exception instanceof BusinessException
    }

    def "should return RunTimeException when status is 500"() {
        given:
        feignErrorDecoderConfiguration = new FeignErrorDecoderConfiguration();
        errorDecoder = feignErrorDecoderConfiguration.errorDecoder()

        def response = GroovyMock(Response)
        ReflectionTestUtils.setField(response,"reason", 'Error')
        ReflectionTestUtils.setField(response,"status", 500)
        when:
        def exception = errorDecoder.decode("methodkey", response)
        then:
        assert exception instanceof RuntimeException
    }
    def "should return RunTimeException when response is null"() {
        given:
        feignErrorDecoderConfiguration = new FeignErrorDecoderConfiguration();
        errorDecoder = feignErrorDecoderConfiguration.errorDecoder()

        when:
        def exception = errorDecoder.decode("methodkey", null)
        then:
        assert exception instanceof RuntimeException
    }
}


