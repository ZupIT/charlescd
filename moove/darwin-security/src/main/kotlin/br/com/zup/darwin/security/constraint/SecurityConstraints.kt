/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.security.constraint

data class SecurityConstraints(
        var constraints: Set<DenyMatcher> = setOf(),
        var publicConstraints: Set<PermitMatcher> = setOf()
) {

    fun allMatchers(): Set<Matcher> = constraints + publicConstraints
}