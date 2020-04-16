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

package br.com.zup.charlescd.villager.infrastructure.filter;

public class RequestContext {

    static final String HEADER_NAME = "X-Request-Id";
    private static final String UNKNOWN_ID = "UNKNOWN";
    private static final ThreadLocal<String> ID = new ThreadLocal<>();

    private RequestContext() {
        // cannot be implemented
    }

    static String getId() {
        return ID.get() == null ? UNKNOWN_ID : ID.get();
    }

    public static String getTag() {

        StringBuilder builder = new StringBuilder();

        builder.append("[");
        builder.append(ID.get());
        builder.append("]");

        return builder.toString();
    }

    static void setId(String id) {

        if (id == null) {
            throw new IllegalArgumentException("Id can not be null");
        }

        ID.set(id);
    }
}
