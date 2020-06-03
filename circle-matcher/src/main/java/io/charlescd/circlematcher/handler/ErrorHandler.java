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

import java.util.NoSuchElementException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ErrorHandler {

    private static final Logger logger = LoggerFactory.getLogger(ErrorHandler.class);

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(NoSuchElementException.class)
    public DefaultErrorResponse handleNotFoundError(NoSuchElementException exception) {
        logger.error("NOT FOUND ERROR - ", exception);
        return new DefaultErrorResponse(exception.getMessage());
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public DefaultErrorResponse handleConstraintsValidation(MethodArgumentNotValidException exception) {
        logger.error("BAD REQUEST ERROR - ", exception);
        return new DefaultErrorResponse("Invalid request body.");
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(IllegalArgumentException.class)
    public DefaultErrorResponse handleIllegalArgument(IllegalArgumentException exception) {
        logger.error("BAD REQUEST ERROR - ", exception);
        return new DefaultErrorResponse(exception.getMessage());
    }

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(Exception.class)
    public DefaultErrorResponse handleException(Exception exception) {
        logger.error("INTERNAL SERVER ERROR - ", exception);
        return new DefaultErrorResponse("Unexpected error. Please, try again later.");
    }
}
