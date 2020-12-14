package io.charlescd.circlematcher.domain.exception;

import java.util.List;

public class BusinessException extends RuntimeException {
    private MatcherErrorCode errorCode;
    private List<String> parameters;
    public BusinessException(MatcherErrorCode matcherErrorCode, List<String> parameters){
        this.parameters = parameters;
        this.errorCode = matcherErrorCode;
    }

    public BusinessException(MatcherErrorCode matcherErrorCode){
        this.errorCode = matcherErrorCode;
    }

    public MatcherErrorCode getErrorCode() {
        return this.errorCode;
    }
}
