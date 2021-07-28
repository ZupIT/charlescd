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

package io.charlescd.moove.legacy.moove.config


import feign.Response
import feign.codec.ErrorDecoder
import io.charlescd.moove.commons.exceptions.BusinessExceptionLegacy
import io.charlescd.moove.legacy.moove.api.config.DefaultLegacyErrorDecoderConfiguration
import org.springframework.test.util.ReflectionTestUtils
import spock.lang.Specification

class DefaultLegacyErrorDecoderConfigurationTest extends Specification {
    DefaultLegacyErrorDecoderConfiguration feignErrorDecoderConfiguration
    ErrorDecoder errorDecoder

    void setup() {
        feignErrorDecoderConfiguration = new DefaultLegacyErrorDecoderConfiguration()
        errorDecoder = feignErrorDecoderConfiguration.defaultLegacyErrorDecoder()
    }

    def "should return illegal argument exception when status is 400"() {
        given:
        def response = GroovyMock(Response)
        def body = Mock(Response.Body)
        ReflectionTestUtils.setField(response, "status", 400)
        ReflectionTestUtils.setField(response, "body", body)

        when:
        def exception = errorDecoder.decode("methodkey", response)

        then:
        body.asInputStream() >> this.getReturnAsInputStream()
        assert exception instanceof IllegalArgumentException
        assert exception.message == 'CdConfiguration not found - id: e29fe7e8-4b35-453a-ad8b-4da910861851'

    }

    def "should return business exception when status is 422"() {
        def response = GroovyMock(Response)
        def body = Mock(Response.Body)
        ReflectionTestUtils.setField(response, "reason", 'Error')
        ReflectionTestUtils.setField(response, "status", 422)
        ReflectionTestUtils.setField(response, "body", body)

        when:
        def exception = errorDecoder.decode("methodkey", response)

        then:
        body.asInputStream() >> this.getArrayMessageReturnAsInputStream()
        assert exception instanceof BusinessExceptionLegacy
        assert exception.message == '[0.Sum of lengths of componentName and buildImageTag cant be greater than 63]'
    }

    def "should return RunTimeException when status is 500"() {
        def response = GroovyMock(Response)
        def body = Mock(Response.Body)
        ReflectionTestUtils.setField(response, "reason", 'Error')
        ReflectionTestUtils.setField(response, "status", 500)
        ReflectionTestUtils.setField(response, "body", body)

        when:
        def exception = errorDecoder.decode("methodkey", response)

        then:
        body.asInputStream() >> this.getArrayMessageReturnAsInputStream()
        assert exception instanceof RuntimeException
        assert exception.message == '[0.Sum of lengths of componentName and buildImageTag cant be greater than 63]'
    }

    def "should return RunTimeException when response is null"() {
        def body = Mock(Response.Body)

        when:
        def exception = errorDecoder.decode("methodkey", null)

        then:
        body.asInputStream() >> this.getArrayMessageReturnAsInputStream()
        assert exception instanceof RuntimeException
        assert exception.message == "The server could not complete the request."
    }

    def "should return RunTimeException when fails to  read response"() {
        def body = Mock(Response.Body)
        def response = GroovyMock(Response)
        ReflectionTestUtils.setField(response, "reason", 'Error')
        ReflectionTestUtils.setField(response, "status", 500)
        ReflectionTestUtils.setField(response, "body", body)

        when:
        def exception = errorDecoder.decode("methodkey", response)

        then:
        body.asInputStream() >> { throw new IOException() }
        assert exception instanceof RuntimeException
        assert exception.message == 'Error reading response of request'
    }

    def "should return run time exception with the original message when can not parse the object "() {
        def body = Mock(Response.Body)
        def response = GroovyMock(Response)
        ReflectionTestUtils.setField(response, "reason", 'Error')
        ReflectionTestUtils.setField(response, "status", 500)
        ReflectionTestUtils.setField(response, "body", body)

        when:
        def exception = errorDecoder.decode("methodkey", response)
        then:

        body.asInputStream() >> getGenericReturnAsInputStream()
        assert exception instanceof RuntimeException
        assert exception.message == "Data not found"
    }

    private InputStream getReturnAsInputStream() {
        String response = "{\n" +
                "    \"statusCode\": 404,\n" +
                "    \"message\": \"CdConfiguration not found - id: e29fe7e8-4b35-453a-ad8b-4da910861851\",\n" +
                "    \"error\": \"Not Found\"\n" +
                "}"
        return new ByteArrayInputStream(response.getBytes())
    }

    private InputStream getArrayMessageReturnAsInputStream() {
        String response = "{\n" +
                "    \"statusCode\": 400,\n" +
                "    \"message\": [\n" +
                "        \"0.Sum of lengths of componentName and buildImageTag cant be greater than 63\"\n" +
                "    ],\n" +
                "    \"error\": \"Bad Request\"\n" +
                "}"
        return new ByteArrayInputStream(response.getBytes())
    }

    private InputStream getGenericReturnAsInputStream() {
        String response = "Data not found"
        return new ByteArrayInputStream(response.getBytes())
    }


}
