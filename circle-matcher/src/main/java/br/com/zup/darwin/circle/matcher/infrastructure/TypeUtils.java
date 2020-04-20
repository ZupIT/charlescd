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

package br.com.zup.darwin.circle.matcher.infrastructure;

public class TypeUtils {

    private static final String TRUE = "true";
    private static final String FALSE = "false";

    private TypeUtils() {
    }

    public static boolean isNumber(String value) {
        var result = true;
        try {
            Double.parseDouble(value);
        } catch (NumberFormatException ex) {
            result = false;
        }
        return result;
    }

    public static boolean isBoolean(String value) {
        return value != null && (value.equals(TRUE) || value.equals(FALSE));
    }

}
