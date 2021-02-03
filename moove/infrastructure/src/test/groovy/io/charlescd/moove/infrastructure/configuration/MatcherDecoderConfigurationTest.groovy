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

import com.fasterxml.jackson.databind.ObjectMapper
import feign.Response
import feign.codec.ErrorDecoder
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.exceptions.ClientException
import org.springframework.beans.factory.ObjectFactory
import org.springframework.boot.autoconfigure.http.HttpMessageConverters
import org.springframework.http.converter.HttpMessageConverter
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter
import org.springframework.test.util.ReflectionTestUtils
import spock.lang.Specification

class MatcherDecoderConfigurationTest extends Specification {
    MatcherEncoderConfiguration.MatcherErrorDecoder matcherErrorDecoder

    void setup() {
        HttpMessageConverter jacksonConverter = new MappingJackson2HttpMessageConverter(new ObjectMapper())
        ObjectFactory<HttpMessageConverters> objectFactory = { -> new HttpMessageConverters(jacksonConverter) }
        matcherErrorDecoder = new MatcherEncoderConfiguration.MatcherErrorDecoder()
    }

    def "should return illegal argument exception when status is 400"() {
        given:
        def response = GroovyMock(Response)
        def body = Mock(Response.Body)
        ReflectionTestUtils.setField(response, "status", 400)
        ReflectionTestUtils.setField(response, "body", body)

        when:
        def exception = matcherErrorDecoder.decode("methodkey", response)

        then:
        body.asInputStream() >> this.getReturnAsInputStream()
        assert exception instanceof ClientException
        assert exception.title == 'Internal Server Error'
        assert exception.details == 'Unexpected error. Please, try again later.'

    }

    private InputStream getReturnAsInputStream() {
        String response = "{\n" +
                "    \"id\": \"8bc5c197-4698-4c55-98eb-021dbd783353\",\n" +
                "    \"links\": [],\n" +
                "    \"title\": \"Internal Server Error\",\n" +
                "    \"details\": \"Unexpected error. Please, try again later.\",\n" +
                "    \"source\": {\n" +
                "        \"pointer\": null\n" +
                "    },\n" +
                "    \"meta\": {\n" +
                "        \"component\": \"circle-matcher\",\n" +
                "        \"timestamp\": \"2021-02-03T17:50:02.639440\"\n" +
                "    }\n" +
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
