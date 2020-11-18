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
import java.io.ByteArrayInputStream
import io.charlescd.moove.domain.exceptions.BusinessException
import org.springframework.test.util.ReflectionTestUtils
import spock.lang.Specification

import java.nio.charset.StandardCharsets


class FeignErrorDecoderConfigurationTest extends Specification {
    FeignErrorDecoderConfiguration feignErrorDecoderConfiguration
    ErrorDecoder errorDecoder

    def "should return illegal argument exception when status is 400"() {
        given:
        feignErrorDecoderConfiguration = new FeignErrorDecoderConfiguration()
        errorDecoder = feignErrorDecoderConfiguration.errorDecoder()
        def response = GroovyMock(Response)
        def body = Mock(Response.Body)
        ReflectionTestUtils.setField(response, "status", 400)
        ReflectionTestUtils.setField(response, "body",body)
        when:
        def exception = errorDecoder.decode("methodkey", response)

        then:
        body.asInputStream() >> this.getReturnAsInputStream()
        assert exception instanceof IllegalArgumentException
        assert exception.message == 'CdConfiguration not found - id: e29fe7e8-4b35-453a-ad8b-4da910861851'

    }

    def "should return business exception when status is 422"() {
        given:
        feignErrorDecoderConfiguration = new FeignErrorDecoderConfiguration()
        errorDecoder = feignErrorDecoderConfiguration.errorDecoder()
        def response = GroovyMock(Response)
        def body = Mock(Response.Body)
        ReflectionTestUtils.setField(response,"reason", 'Error')
        ReflectionTestUtils.setField(response,"status", 422)
        ReflectionTestUtils.setField(response,"body", body)
        when:
        def exception = errorDecoder.decode("methodkey", response)
        then:
        body.asInputStream() >> this.getAnotherReturnAsInputStream()
        assert exception instanceof BusinessException
        assert exception.message == '[0.Sum of lengths of componentName and buildImageTag cant be greater than 63]'
    }

    def "should return RunTimeException when status is 500"() {
        given:
        feignErrorDecoderConfiguration = new FeignErrorDecoderConfiguration();
        errorDecoder = feignErrorDecoderConfiguration.errorDecoder()
        def response = GroovyMock(Response)
        def body = Mock(Response.Body)
        ReflectionTestUtils.setField(response,"reason", 'Error')
        ReflectionTestUtils.setField(response,"status", 500)
        ReflectionTestUtils.setField(response,"body", body)
        when:
        def exception = errorDecoder.decode("methodkey", response)
        then:
        body.asInputStream() >> this.getAnotherReturnAsInputStream()
        assert exception instanceof RuntimeException
        assert exception.message == '[0.Sum of lengths of componentName and buildImageTag cant be greater than 63]'
    }
    def "should return RunTimeException when response is null"() {
        given:
        feignErrorDecoderConfiguration = new FeignErrorDecoderConfiguration();
        errorDecoder = feignErrorDecoderConfiguration.errorDecoder()
        def body = Mock(Response.Body)
        when:
        def exception = errorDecoder.decode("methodkey", null)
        then:
        body.asInputStream() >> this.getAnotherReturnAsInputStream()
        assert exception instanceof RuntimeException
        assert exception.message == null
    }
    private InputStream getReturnAsInputStream() {
        String response = "{\n" +
                "    \"statusCode\": 404,\n" +
                "    \"message\": \"CdConfiguration not found - id: e29fe7e8-4b35-453a-ad8b-4da910861851\",\n" +
                "    \"error\": \"Not Found\"\n" +
                "}"
       return new ByteArrayInputStream(response.getBytes())
    }
    private InputStream getAnotherReturnAsInputStream() {
        String response = "{\n" +
                "    \"statusCode\": 400,\n" +
                "    \"message\": [\n" +
                "        \"0.Sum of lengths of componentName and buildImageTag cant be greater than 63\"\n" +
                "    ],\n" +
                "    \"error\": \"Bad Request\"\n" +
                "}"
        return new ByteArrayInputStream(response.getBytes())
    }

}


