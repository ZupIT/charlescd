package io.charlescd.circlematcher.domain.exception;

public class BusinessException extends RuntimeException {
    private MatcherErrorCode errorCode;

    public BusinessException(MatcherErrorCode matcherErrorCode) {
        this.errorCode = matcherErrorCode;
    }

    public MatcherErrorCode getErrorCode() {
        return this.errorCode;
    }
}
