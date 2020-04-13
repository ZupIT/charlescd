/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.api.misc;

public class ErrorRepresentation {

    private String message;

    public ErrorRepresentation(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
