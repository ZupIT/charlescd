package io.charlescd.circlematcher.domain.exception;

public class BusinessException extends RuntimeException {
    private MatcherErrorCode errorCode;
    private String  source;
    private String  title;

    public BusinessException(MatcherErrorCode errorCode, String source, String title) {
        this.errorCode = errorCode;
        this.source = source;
        this.title = title;
    }

    public BusinessException withParameters(String parameters) {
        this.getErrorCode().appendParameter(parameters);
        return this;
    }

    public MatcherErrorCode getErrorCode() {
        return this.errorCode;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public BusinessException(MatcherErrorCode errorCode, String title) {
        this.errorCode = errorCode;
        this.title = title;
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
}
