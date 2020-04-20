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

public class Constants {

    private Constants() {
    }

    public static final String OR = "||";

    public static final String AND = "&&";

    public static final String TRUE = "true";

    public static final String FALSE = "false";

    public static final String START_EXPRESSION = "(";

    public static final String END_EXPRESSION = ")";

    public static final String STRING_PREFIX = "'";

    public static final String STRING_SUFFIX = "'";

    public static final String ARRAY_PREFIX = "[";

    public static final String ARRAY_SUFFIX = "]";

    public static final String ARRAY_SEPARATOR = ",";

    public static final String DOT = ".";

    public static final String EQUALS_EXPRESSION = "%s.indexOf(%s) != -1";

    public static final String NOT_EQUALS_EXPRESSION = "%s.indexOf(%s) >= 0";

    public static final String EVAL_EXPRESSION = "var result = (%s)";

    public static final String INPUT_VARIABLE = "input";

    public static final String GET_PATH_EXPRESSION = "getPath(%s, '%s')";

    public static final String RESULT_VARIABLE = "result";

    public static final String KEY_COMPONENTS_DELIMITER = ":";

    public static final String KEY_DELIMITER = "_";

}
