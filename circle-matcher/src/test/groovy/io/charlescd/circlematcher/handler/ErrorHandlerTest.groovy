package io.charlescd.circlematcher.handler

import io.charlescd.circlematcher.domain.exception.BusinessException
import io.charlescd.circlematcher.domain.exception.MatcherErrorCode;
import spock.lang.Specification;

class ErrorHandlerTest extends Specification {


    def "should return the correct message from business exception method"() {
        def errorHandler = new ErrorHandler();
        def businessException = new BusinessException(MatcherErrorCode.CANNOT_UPDATE_DEFAULT_SEGMENTATION)
        def response = errorHandler.handleBusinessException(businessException)
        assert response.message == 'cannot.update.default.segmentation'
    }
}
