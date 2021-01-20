package io.charlescd.circlematcher.domain.exception;

public class BusinessException extends RuntimeException {
    private MatcherErrorCode errorCode;
    private String  source;

    public BusinessException(MatcherErrorCode errorCode, String source) {
        this.errorCode = errorCode;
        this.source = source;
    }

    public BusinessException(MatcherErrorCode matcherErrorCode) {
        this.errorCode = matcherErrorCode;
    }

    public MatcherErrorCode getErrorCode() {
        return this.errorCode;
    }

    public void setErrorCode(MatcherErrorCode errorCode) {
        this.errorCode = errorCode;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public BusinessException withParameters(String parameters) {
        this.getErrorCode().appendParameter(parameters);
        return this;
    }
}
