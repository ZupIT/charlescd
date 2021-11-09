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

import feign.Response
import feign.codec.ErrorDecoder
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.exceptions.BusinessException
import org.springframework.test.util.ReflectionTestUtils
import spock.lang.Specification

class ButlerErrorDecoderTest extends Specification {
    ErrorDecoder errorDecoder

    void setup() {
        ButlerEncoderConfiguration butlerEncoderConfiguration = new ButlerEncoderConfiguration()
        errorDecoder = butlerEncoderConfiguration.butlerErrorDecoder()
    }

    def "should throw business exception when status is 401"() {
        given:
        def response = GroovyMock(Response)
        def body = Mock(Response.Body)
        ReflectionTestUtils.setField(response, "status", 401)
        ReflectionTestUtils.setField(response, "body", body)

        when:
        def exception = errorDecoder.decode("methodkey", response)

        then:
        body.asReader() >> this.getReturnAsReader()
        assert exception instanceof BusinessException
        assert exception.parameters[0].contains( "Unable to fetch resource from github url: https://api.github.com/repos/zupit/charlescd-automation-releases/contents/dragonboarding?ref=release-dev-v-21")
        assert exception.errorCode == MooveErrorCode.UNAUTHORIZED

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
