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
import org.springframework.validation.ObjectError
import org.springframework.web.bind.MethodArgumentNotValidException;
import spock.lang.Specification
import java.time.LocalDateTime;

class ErrorHandlerTest extends Specification {

    def "should return the correct message from business exception method"() {
        given:

        def errorHandler = new ErrorHandler();
        def businessException = new BusinessException(
                MatcherErrorCode.CANNOT_UPDATE_DEFAULT_SEGMENTATION,
                "Error updating segmentation"
        );
        def metaInfo = new HashMap<String,String>();
        metaInfo.put("component", "circle-matcher");

        when:
        def response = errorHandler.handleBusinessException(businessException)

        then:
        assert response.links == []
        assert response.id instanceof String
        assert response.details == 'Cannot update default segmentation'
        assert response.title == 'Error updating segmentation'
        assert response.status == "400"
        assert response.meta.get("component") == metaInfo.get("component")
    }

    def "should return the correct message from not found exception method"() {
        given:

        def errorHandler = new ErrorHandler();
        def noSuchElement = new NoSuchElementException("Default metadata not found")
        def metaInfo = new HashMap<String,String>();
        metaInfo.put("component", "circle-matcher");

        when:
        def response = errorHandler.handleNotFoundError(noSuchElement)
        then:
        assert response.links == []
        assert response.id instanceof String
        assert response.details == 'Default metadata not found'
        assert response.title == 'Not found'
        assert response.status == "404"
        assert response.meta.get("component") == metaInfo.get("component")
    }

    def "should return the correct message from business exception method with source"() {
        given:

        def errorHandler = new ErrorHandler();
        def businessException = new BusinessException(
                MatcherErrorCode.DEFAULT_SEGMENTATION_ALREADY_REGISTERED_IN_WORKSPACE,
                "segmentation/workspaceId",
                "Error creating segmentation",
        ).withParameters("123456");
        def metaInfo = new HashMap<String,String>();
        metaInfo.put("component", "circle-matcher");

        when:
        def response = errorHandler.handleBusinessException(businessException)
        then:
        assert response.links == []
        assert response.id instanceof String
        assert response.details.contains('Default segmentation already registered in workspace')
        assert response.title == 'Error creating segmentation'
        assert response.status == "400"
        assert response.meta.get("component") == metaInfo.get("component")
        assert response.source.get("pointer") == "segmentation/workspaceId"
    }

    def "should return the correct message from bad request exception"() {
        given:
        def errorHandler = new ErrorHandler();
        def businessException = new IllegalArgumentException("argument not valid")
        def metaInfo = new HashMap<String,String>();
        metaInfo.put("timestamp", LocalDateTime.now().toString());
        metaInfo.put("component", "circle-matcher");

        when:
        def response = errorHandler.handleIllegalArgument(businessException)
        then:
        assert response.details == 'argument not valid'
        assert response.title == 'Bad Request'
        assert response.status == "400"
        assert response.meta.get("component") == metaInfo.get("component")
    }

    def "should return the correct message from ilegal argument"() {
        given:
        def errorHandler = new ErrorHandler();
        def illegalArgumentException = new IllegalArgumentException("argument not valid")
        def metaInfo = new HashMap<String,String>();
        metaInfo.put("component", "circle-matcher");

        when:
        def response = errorHandler.handleIllegalArgument(illegalArgumentException)
        then:
        assert response.links == []
        assert response.id instanceof String
        assert response.details == 'argument not valid'
        assert response.title == 'Bad Request'
        assert response.status == "400"
        assert response.meta.get("component") == metaInfo.get("component")
    }

    def "should return the correct message from http message not readable"() {
        given:
        def errorHandler = new ErrorHandler();
        def httpMessage = new HttpMessageNotReadableException("message not readable")
        def metaInfo = new HashMap<String,String>();
        metaInfo.put("component", "circle-matcher");

        when:
        def response = errorHandler.handleHttpMessageNotReadableException(httpMessage)
        then:
        assert response.links == []
        assert response.id instanceof String
        assert response.details == 'message not readable'
        assert response.title == 'Bad Request'
        assert response.status == "400"
        assert response.meta.get("component") == metaInfo.get("component")
    }

    def "should return the correct message from internal server error exception"() {
        given:
        def errorHandler = new ErrorHandler();
        def exception = new Exception("null pointer")
        def metaInfo = new HashMap<String,String>();
        metaInfo.put("component", "circle-matcher");

        when:
        def response = errorHandler.handleException(exception)
        then:
        assert response.links == []
        assert response.id instanceof String
        assert response.details == 'Unexpected error. Please, try again later.'
        assert response.title == 'Internal Server Error'
        assert response.status == "500"
        assert response.meta.get("component") == metaInfo.get("component")
    }

    def "should return the correct message from constraint validation exception"() {
        given:
        def errorHandler = new ErrorHandler();

        def exception = Mock(MethodArgumentNotValidException)
        def metaInfo = new HashMap<String,String>();
        metaInfo.put("component", "circle-matcher");
        def fieldErrors = new FieldError("segmentation", "node", "Invalid node")
        def objectError = new ObjectError("node", [] as String[], [] as String[], "Invalid node")
        when:
        def response = errorHandler.handleConstraintsValidation(exception)
        then:
        exception.getMessage() >> "Error validating node"
        exception.getAllErrors() >> [objectError]
        exception.getFieldErrors() >> [fieldErrors]
        assert response.links == []
        assert response.id instanceof String
        assert response.details == 'Invalid request body.node: Invalid node'
        assert response.title == 'Bad Request'
        assert response.status == "400"
        assert response.source.get("pointer") == "segmentation/node"
        assert response.meta.get("component") == metaInfo.get("component")
    }

}
