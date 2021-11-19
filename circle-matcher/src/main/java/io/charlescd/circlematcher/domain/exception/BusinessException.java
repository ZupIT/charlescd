/*
 *
 *  Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

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
