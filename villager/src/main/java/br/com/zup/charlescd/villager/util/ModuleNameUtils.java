/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.util;

import javax.validation.constraints.NotNull;

public class ModuleNameUtils {

    private ModuleNameUtils() {
    }

    public static String normalize(@NotNull String name) {
        String[] nameArray = name.split("/");
        if (nameArray.length > 1) {
            return nameArray[1];
        }
        return name;
    }

}
