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

package io.charlescd.circlematcher.infrastructure;

import org.springframework.util.FileCopyUtils;

import java.io.IOException;
import java.io.InputStreamReader;

public class ResourceUtils {

    private ResourceUtils() {
    }

    public static String getResourceAsString(String name) {
        try {
            var resource = ResourceUtils.class.getClassLoader().getResourceAsStream(name);
            if (resource == null) {
                throw new IOException();
            }
            return FileCopyUtils.copyToString(new InputStreamReader(resource));
        } catch (IOException ex) {
            throw new RuntimeException("Resource not found.", ex);
        }
    }

}
