/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.circle.matcher.infrastructure;

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
