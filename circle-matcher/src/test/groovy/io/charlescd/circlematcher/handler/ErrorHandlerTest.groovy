package io.charlescd.circlematcher.handler

import io.charlescd.circlematcher.domain.exception.BusinessException
import io.charlescd.circlematcher.domain.exception.MatcherErrorCode;
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
        metaInfo.put("timestamp", LocalDateTime.now().toString());
        metaInfo.put("component", "circle-matcher");

        when:
        def response = errorHandler.handleBusinessException(businessException)
        then:
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
        metaInfo.put("timestamp", LocalDateTime.now().toString());
        metaInfo.put("component", "circle-matcher");

        when:
        def response = errorHandler.handleNotFoundError(noSuchElement)
        then:
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
        );
        def metaInfo = new HashMap<String,String>();
        metaInfo.put("timestamp", LocalDateTime.now().toString());
        metaInfo.put("component", "circle-matcher");

        when:
        def response = errorHandler.handleBusinessException(businessException)
        then:
        assert response.details == 'Default segmentation already registered in workspace'
        assert response.title == 'Error creating segmentation'
        assert response.status == "400"
        assert response.meta.get("component") == metaInfo.get("component")
        assert response.source.pointer = "segmentation/workspaceId"
    }

}
