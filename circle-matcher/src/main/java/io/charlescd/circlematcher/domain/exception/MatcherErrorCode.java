package io.charlescd.circlematcher.domain.exception;

public enum MatcherErrorCode {
    CANNOT_UPDATE_DEFAULT_SEGMENTATION("cannot.update.default.segmentation"),
    DEFAULT_SEGMENTATION_ALREADY_REGISTERED_IN_WORKSPACE("default.segmentation.already.registered.in.workspace");
    private String key;

    MatcherErrorCode(String key) {
        this.key = key;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }
}
