/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.charlescd.circlematcher.handler;

import static java.util.stream.Collectors.joining;

import io.charlescd.circlematcher.domain.exception.BusinessException;
import java.util.List;
import java.util.NoSuchElementException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;


@RestControllerAdvice
public class ErrorHandler {

    private static final Logger logger = LoggerFactory.getLogger(ErrorHandler.class);

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(BusinessException.class)
    public DefaultErrorResponse handleBusinessException(BusinessException exception) {
        logger.error("BAD REQUEST ERROR - ", exception.getErrorCode());
        return ExceptionUtils.createBusinessExceptionError(
                exception.getErrorCode().getKey(),
                exception.getTitle(),
                exception.getSource()
        );
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(NoSuchElementException.class)
    public DefaultErrorResponse handleNotFoundError(NoSuchElementException exception) {
        logger.error("NOT FOUND ERROR - ", exception);
        return ExceptionUtils.createNotFoundErrorResponse(
                exception.getMessage(),
                null
        );
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public DefaultErrorResponse handleConstraintsValidation(MethodArgumentNotValidException exception) {
        logger.error("BAD REQUEST ERROR - ", exception);
        String message = "Invalid request body." + processFieldErrors(exception.getFieldErrors());
        return ExceptionUtils.createBadRequestError(message, getSourceFields(exception.getFieldErrors()));
    }

    private String getSourceFields(List<FieldError> fieldErrors) {
        return fieldErrors.stream()
                .map(field -> String.format("%s/%s", "segmentation", field.getField())).collect(joining("\n"));
    }

    private String processFieldErrors(List<FieldError> fieldErrors) {
        return fieldErrors.stream()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .collect(joining("\n"));
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(IllegalArgumentException.class)
    public DefaultErrorResponse handleIllegalArgument(IllegalArgumentException exception) {
        logger.error("BAD REQUEST ERROR - ", exception);
        return ExceptionUtils.createBadRequestError(
                exception.getMessage(),
                null
        );
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public DefaultErrorResponse handleHttpMessageNotReadableException(HttpMessageNotReadableException exception) {
        logger.error("BAD REQUEST ERROR - ", exception);
        return  ExceptionUtils.createBadRequestError(
                exception.getMessage(),
                null
        );
    }

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(Exception.class)
    public DefaultErrorResponse handleException(Exception exception) {
        logger.error("INTERNAL SERVER ERROR - ", exception);
        return ExceptionUtils.createInternalServerError(
                "Unexpected error. Please, try again later.",
                null
        );
    }
}
