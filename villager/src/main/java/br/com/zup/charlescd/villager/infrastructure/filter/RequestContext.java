/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
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
