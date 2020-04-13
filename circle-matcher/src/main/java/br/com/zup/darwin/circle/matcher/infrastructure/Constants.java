/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
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
