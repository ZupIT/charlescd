package io.charlescd.circlematcher.domain.exception;

public enum MatcherErrorCode {
    CANNOT_UPDATE_DEFAULT_SEGMENTATION("Cannot update default segmentation"),
    DEFAULT_SEGMENTATION_ALREADY_REGISTERED_IN_WORKSPACE("Default segmentation already registered in workspace");

    private String  key;

    MatcherErrorCode(String  key) {
        this.key = key;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public void appendParameter(String parameters) {
        this.key = String.format("%s: %s", this.key, parameters);
    }
}
