/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.security.constraint

object MatchersHelper {

    val allowedMethods = listOf("DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE", "CONNECT")

    fun validatePattern(pattern: String) {
        if (pattern.isBlank()) {
            throw SecurityConstraintsException("Matcher pattern could not be blank")
        }
    }

    fun validateMethods(methods: Any) {
        if (methods !is Collection<*>) {
            throw SecurityConstraintsException("Invalid methods")
        }

        if (!allowedMethods.containsAll(methods)) {
            throw SecurityConstraintsException("Unknown method")
        }
    }

}