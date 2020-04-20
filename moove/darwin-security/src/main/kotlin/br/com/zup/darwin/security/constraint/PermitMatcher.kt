/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.security.constraint

import org.springframework.util.AntPathMatcher

class PermitMatcher(var pattern: String = "", var methods: Set<String> = setOf()) : Matcher {

    override fun authorizationsRules(
        path: String,
        method: String,
        authorization: String?,
        applicationId: String?
    ): Boolean {
        val pathPattern = AntPathMatcher()
        if (pathPattern.match(pattern, path)) {
            if (methods.contains(method)) {
                return true
            }
        }
        return false
    }

    override fun validate() {
        MatchersHelper.validatePattern(pattern)
        MatchersHelper.validateMethods(methods)
    }

}