package io.charlescd.circlematcher.handler

import io.charlescd.circlematcher.domain.exception.BusinessException
import io.charlescd.circlematcher.domain.exception.MatcherErrorCode
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.validation.FieldError
import org.springframework.web.bind.MethodArgumentNotValidException
import spock.lang.Specification

import java.time.LocalDateTime

class DefaultErrorResponseTest extends Specification {


    def "should return the correct message from business exception method"() {
        when:
        def defaultErrorResponse = new DefaultErrorResponse(
                UUID.randomUUID().toString(),
                [],
                "title",
                "details",
                "400",
                new HashMap<String, String>(),
                new HashMap<String, String>()
        )
        then:
        assert defaultErrorResponse.links == []
        assert defaultErrorResponse.id instanceof String
        assert defaultErrorResponse.details == 'details'
        assert defaultErrorResponse.title == 'title'
        assert defaultErrorResponse.status == "400"
        assert defaultErrorResponse.meta.size() == 0
        assert defaultErrorResponse.source.size() == 0
    }


}
