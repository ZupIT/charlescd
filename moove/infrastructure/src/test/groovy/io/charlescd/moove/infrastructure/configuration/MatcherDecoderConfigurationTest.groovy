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
import io.charlescd.moove.domain.exceptions.BadRequestClientException
import io.charlescd.moove.domain.exceptions.InternalErrorClientException
import io.charlescd.moove.domain.exceptions.NotFoundClientException
import org.springframework.test.util.ReflectionTestUtils
import spock.lang.Specification

class MatcherDecoderConfigurationTest extends Specification {
    MatcherEncoderConfiguration.MatcherErrorDecoder matcherErrorDecoder

    void setup() {
        matcherErrorDecoder = new MatcherEncoderConfiguration.MatcherErrorDecoder()
    }

    def "should return BadRequestClientException when status is 400"() {
        given:
        def response = GroovyMock(Response)
        def body = Mock(Response.Body)
        ReflectionTestUtils.setField(response, "status", 400)
        ReflectionTestUtils.setField(response, "body", body)

        when:
        def exception = matcherErrorDecoder.decode("methodkey", response)

        then:
        body.asInputStream() >> this.getReturnAsInputStream()
        assert exception instanceof BadRequestClientException
        assert exception.title == 'Bad Request'
        assert exception.details == 'Invalid request body.node: Invalid Node'
        assert exception.status == '400'
        assert exception.meta.get("component") == "circle-matcher"
        assert exception.source.get("pointer") == "segmentation/node"
    }

    def "should return InternalErrorClientException when status is 500"() {
        given:
        def response = GroovyMock(Response)
        def body = Mock(Response.Body)
        ReflectionTestUtils.setField(response, "status", 500)
        ReflectionTestUtils.setField(response, "body", body)

        when:
        def exception = matcherErrorDecoder.decode("methodkey", response)

        then:
        body.asInputStream() >> getReturnInternalErrorAsInputStream()
        assert exception instanceof InternalErrorClientException
        assert exception.title == 'Internal Server Error'
        assert exception.details == 'Unexpected error. Please, try again later.'
        assert exception.status == '500'
        assert exception.meta.get("component") == "circle-matcher"
    }

    def "should return NotFoundClientException when status is 500"() {
        given:
        def response = GroovyMock(Response)
        def body = Mock(Response.Body)
        ReflectionTestUtils.setField(response, "status", 404)
        ReflectionTestUtils.setField(response, "body", body)

        when:
        def exception = matcherErrorDecoder.decode("methodkey", response)

        then:
        body.asInputStream() >> getReturnNotFoundAsInputStream()
        assert exception instanceof NotFoundClientException
        assert exception.title == 'Not found'
        assert exception.details == 'Default circle metadata not found.'
        assert exception.status == '404'
        assert exception.meta.get("component") == "circle-matcher"
    }

    def "should return the correct entity data when fails to ready response"() {
        given:
        def response = GroovyMock(Response)
        def body = Mock(Response.Body)
        ReflectionTestUtils.setField(response, "status", 400)
        ReflectionTestUtils.setField(response, "body", body)

        when:
        def exception = matcherErrorDecoder.decode("methodkey", response)

        then:
        body.asInputStream() >> { throw new IOException() }
        assert exception instanceof BadRequestClientException
        assert exception.title == 'Error reading response'
        assert exception.status == '500'
        assert exception.meta.get("component") == "moove"

    }

    def "should return the correct entity data when response body is null"() {
        given:
        def response = GroovyMock(Response)
        def body = Mock(Response.Body)
        ReflectionTestUtils.setField(response, "status", 400)
        ReflectionTestUtils.setField(response, "body", null)

        when:
        def exception = matcherErrorDecoder.decode("methodkey", response)

        then:
        body.asInputStream() >> { throw new IOException() }
        assert exception instanceof BadRequestClientException
        assert exception.title == 'No response body'
        assert exception.status == '500'
        assert exception.meta.get("component") == "moove"

    }

    def "should return the correct entity data when response is null"() {
        given:
        def response = GroovyMock(Response)
        def body = Mock(Response.Body)


        when:
        def exception = matcherErrorDecoder.decode("methodkey", response)

        then:
        body.asInputStream() >> { getReturnAsInputStream()}
        assert exception instanceof InternalErrorClientException
        assert exception.title == 'No response body'
        assert exception.status == '500'
        assert exception.meta.get("component") == "moove"

    }

    private InputStream getReturnAsInputStream() {
        String response = "{\n" +
                "    \"id\": \"3c402eb6-a728-46dd-bf6b-f2f7e75df4f2\",\n" +
                "    \"links\": [],\n" +
                "    \"title\": \"Bad Request\",\n" +
                "    \"details\": \"Invalid request body.node: Invalid Node\",\n" +
                "    \"status\": \"400\",\n" +
                "    \"source\": {\n" +
                "        \"pointer\": \"segmentation/node\"\n" +
                "    },\n" +
                "    \"meta\": {\n" +
                "        \"component\": \"circle-matcher\",\n" +
                "        \"timestamp\": \"2021-02-08T10:35:38.229499\"\n" +
                "    }\n" +
                "}"
        return new ByteArrayInputStream(response.getBytes())
    }

    private InputStream getReturnInternalErrorAsInputStream() {
            String response = "{\n" +
                    "    \"id\": \"53c8362c-15ce-4659-9007-418cc0ea857a\",\n" +
                    "    \"links\": [],\n" +
                    "    \"title\": \"Internal Server Error\",\n" +
                    "    \"details\": \"Unexpected error. Please, try again later.\",\n" +
                    "    \"status\": \"500\",\n" +
                    "    \"source\": {\n" +
                    "        \"pointer\": null\n" +
                    "    },\n" +
                    "    \"meta\": {\n" +
                    "        \"component\": \"circle-matcher\",\n" +
                    "        \"timestamp\": \"2021-02-08T10:30:47.799706\"\n" +
                    "    }\n" +
                    "}"
        return new ByteArrayInputStream(response.getBytes())
    }

    private InputStream getReturnNotFoundAsInputStream() {
        String response = "{\n" +
                "    \"id\": \"1799a5c9-7101-4db1-8520-670aa33e0c4d\",\n" +
                "    \"links\": [],\n" +
                "    \"title\": \"Not found\",\n" +
                "    \"details\": \"Default circle metadata not found.\",\n" +
                "    \"status\": \"404\",\n" +
                "    \"source\": {\n" +
                "        \"pointer\": null\n" +
                "    },\n" +
                "    \"meta\": {\n" +
                "        \"component\": \"circle-matcher\",\n" +
                "        \"timestamp\": \"2021-02-08T10:28:05.852755\"\n" +
                "    }\n" +
                "}"
        return new ByteArrayInputStream(response.getBytes())
    }

}
