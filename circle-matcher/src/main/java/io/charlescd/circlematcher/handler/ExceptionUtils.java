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

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class ExceptionUtils {

    public static DefaultErrorResponse createNotFoundErrorResponse(String message, String sourceString) {
        return createExceptionError(message, "Not found", sourceString, "404");
    }

    public static DefaultErrorResponse createBadRequestError(String message, String sourceString) {
        return createExceptionError(message, "Bad Request", sourceString, "400");
    }

    public static DefaultErrorResponse createBusinessExceptionError(
            String message,
            String title,
            String sourceString
    ) {
        return createExceptionError(message, title, sourceString, "400");
    }

    public static DefaultErrorResponse createInternalServerError(String message, String sourceString) {

        return createExceptionError(message, "Internal Server Error", sourceString, "500");
    }

    private static Map<String, String> getMetaInfo() {
        Map<String, String> metaInfo = new HashMap<String, String>();
        metaInfo.put("timestamp", LocalDateTime.now().toString());
        metaInfo.put("component", "circle-matcher");
        return metaInfo;
    }

    public static DefaultErrorResponse createExceptionError(
            String message,
            String title,
            String sourceString,
            String status) {
        Map<String, String> source = new HashMap<String, String>();
        source.put("pointer", sourceString);
        return new DefaultErrorResponse(UUID.randomUUID().toString(),
                new ArrayList<String>(),
                title,
                message,
                status,
                source,
                getMetaInfo()
        );
    }

}
