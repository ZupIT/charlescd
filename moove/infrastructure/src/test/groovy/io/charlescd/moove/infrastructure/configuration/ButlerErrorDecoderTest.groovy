/*
 * Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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
import io.charlescd.moove.domain.exceptions.UnauthorizedException
import org.springframework.beans.factory.ObjectFactory
import org.springframework.boot.autoconfigure.http.HttpMessageConverters
import org.springframework.http.converter.HttpMessageConverter
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter
import org.springframework.test.util.ReflectionTestUtils
import spock.lang.Specification

class ButlerErrorDecoderTest extends Specification {
    ButlerEncoderConfiguration ButlerEncoderConfiguration
    ErrorDecoder errorDecoder

    void setup() {
        HttpMessageConverter jacksonConverter = new MappingJackson2HttpMessageConverter(new ObjectMapper())
        ObjectFactory<HttpMessageConverters> objectFactory = { -> new HttpMessageConverters(jacksonConverter) }
        ButlerEncoderConfiguration butlerEncoderConfiguration = new ButlerEncoderConfiguration(objectFactory)
        errorDecoder = butlerEncoderConfiguration.butlerErrorDecoder()
    }

    def "should return unauthorized when status is 401"() {
        given:
        def response = GroovyMock(Response)
        def body = Mock(Response.Body)
        ReflectionTestUtils.setField(response, "status", 401)
        ReflectionTestUtils.setField(response, "body", body)

        when:
        def exception = errorDecoder.decode("methodkey", response)

        then:
        body.asReader() >> this.getReturnAsReader()
        assert exception instanceof UnauthorizedException
        assert exception.details.contains( "Unable to fetch resource from github url: https://api.github.com/repos/zupit/charlescd-automation-releases/contents/dragonboarding?ref=release-dev-v-21")

    }
    private Reader getReturnAsReader() {
        String response = "{\n" +
                "    \"errors\": [\n" +
                "        {\n" +
                "            \"title\": \"Unable to fetch resource from github url: https://api.github.com/repos/zupit/charlescd-automation-releases/contents/dragonboarding?ref=release-dev-v-21\",\n" +
                "            \"detail\": \"Status 'Unauthorized' with error: Error: Request failed with status code 401\",\n" +
                "            \"meta\": {\n" +
                "                \"component\": \"butler\",\n" +
                "                \"timestamp\": 1631830774406\n" +
                "            },\n" +
                "            \"status\": 401,\n" +
                "            \"source\": {\n" +
                "                \"pointer\": \"components.helmRepository\"\n" +
                "            }\n" +
                "        }\n" +
                "    ]\n" +
                "}"
        return new InputStreamReader(new ByteArrayInputStream(response.getBytes()));
    }

}
