/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
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
