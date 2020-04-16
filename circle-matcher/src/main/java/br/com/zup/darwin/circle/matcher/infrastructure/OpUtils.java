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

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public class OpUtils {

    private static final Integer DEFAULT_BUFFER = 256;

    private OpUtils() {
    }

    public static List<String> removeNullElements(List<String> values) {
        return values.stream().filter(value -> value != null && !"null".equals(value)).collect(Collectors.toList());
    }

    public static String arrVal(List<String> values) {
        var stringBuilder = new StringBuilder(DEFAULT_BUFFER);

        stringBuilder.append(Constants.ARRAY_PREFIX);
        values.forEach(s -> stringBuilder.append(strVal(s)).append(Constants.ARRAY_SEPARATOR));
        stringBuilder.setLength(stringBuilder.length() - 1);

        return stringBuilder
                .append(Constants.ARRAY_SUFFIX)
                .toString();
    }

    public static String strVal(String value) {
        return Constants.STRING_PREFIX + value + Constants.STRING_SUFFIX;
    }

    public static String bestVal(String value) {

        if (TypeUtils.isNumber(value)) {
            return value;
        }

        return Constants.STRING_PREFIX + value + Constants.STRING_SUFFIX;

    }

    public static String inputValue(String variable) {
        return String.format(Constants.GET_PATH_EXPRESSION, Constants.INPUT_VARIABLE, variable);
    }

    public static String containsExpression(String key, List<String> values) {
        return String.format(Constants.EQUALS_EXPRESSION, arrVal(removeNullElements(values)), key);
    }

    public static String notContainsExpression(String key, List<String> values) {
        return String.format(Constants.NOT_EQUALS_EXPRESSION, arrVal(removeNullElements(values)), key);
    }

    public static String evalExpression(String expression) {
        return String.format(Constants.EVAL_EXPRESSION, expression);
    }

    public static boolean isSingleVal(List<String> values) {
        return values.size() == 1;
    }

    public static Optional<String> singleVal(List<String> values) {
        if (values.isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(values.get(0));
    }
}
