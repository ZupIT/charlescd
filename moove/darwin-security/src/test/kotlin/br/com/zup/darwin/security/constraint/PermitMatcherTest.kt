/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.security.constraint

import org.junit.Assert
import org.junit.Test

class PermitMatcherTest {

    @Test
    fun shouldAuthorizationsRules() {
        val permitMatcher = PermitMatcher(pattern = "/api/square", methods = setOf("GET"))
        Assert.assertTrue(permitMatcher.authorizationsRules(path = "/api/square", method = "GET"))
    }

    @Test
    fun shouldAuthorizationsRulesForVersion() {
        val permitMatcher = PermitMatcher(pattern = "/v{\\d+}/api/square", methods = setOf("GET"))
        Assert.assertTrue(permitMatcher.authorizationsRules(path = "/v1/api/square", method = "GET"))
    }

    @Test
    fun shouldAuthorizationsRulesRegexParams() {
        val permitMatcher = PermitMatcher(pattern = "/api/{param}", methods = setOf("GET"))
        Assert.assertTrue(permitMatcher.authorizationsRules(path = "/api/square", method = "GET"))
    }

    @Test
    fun shouldAuthorizationsRulesRegexAny() {
        val permitMatcher = PermitMatcher(pattern = "/api/*", methods = setOf("GET"))
        Assert.assertTrue(permitMatcher.authorizationsRules(path = "/api/square", method = "GET"))
    }

    @Test
    fun shouldAuthorizationsRulesRegexAnyAny() {
        val permitMatcher = PermitMatcher(pattern = "/api/**", methods = setOf("GET"))
        Assert.assertTrue(permitMatcher.authorizationsRules(path = "/api/square/1/2/3", method = "GET"))
    }

    @Test
    fun shouldAuthorizationsRulesMiddleRegex() {
        val permitMatcher = PermitMatcher(pattern = "/api/*/end", methods = setOf("GET"))
        Assert.assertTrue(permitMatcher.authorizationsRules(path = "/api/square/end", method = "GET"))
    }

    @Test
    fun shouldNotAuthorizationsRules() {
        val permitMatcher = PermitMatcher(pattern = "/api/squar", methods = setOf("GET"))
        Assert.assertFalse(permitMatcher.authorizationsRules(path = "/api/square", method = "GET"))
    }

    @Test
    fun shouldNotAuthorizationsRulesForVersion() {
        val permitMatcher = PermitMatcher(pattern = "/v{\\d+}/api/square", methods = setOf("GET"))
        Assert.assertFalse(permitMatcher.authorizationsRules(path = "/test/api/square", method = "GET"))
    }

    @Test
    fun shouldNotAuthorizationsRulesRegexParams() {
        val permitMatcher = PermitMatcher(pattern = "/api/{param}", methods = setOf("GET"))
        Assert.assertFalse(permitMatcher.authorizationsRules(path = "/api/square/end", method = "GET"))
    }

    @Test
    fun shouldNotAuthorizationsRulesRegexAny() {
        val permitMatcher = PermitMatcher(pattern = "/api/*", methods = setOf("GET"))
        Assert.assertFalse(permitMatcher.authorizationsRules(path = "/api", method = "GET"))
    }

    @Test
    fun shouldNotAuthorizationsRulesMiddleRegex() {
        val permitMatcher = PermitMatcher(pattern = "/api/*/end", methods = setOf("GET"))
        Assert.assertFalse(permitMatcher.authorizationsRules(path = "/api/square", method = "GET"))
    }

    @Test
    fun shouldNotAuthorizationsRulesForGet() {
        val permitMatcher = PermitMatcher(pattern = "/api/square", methods = setOf("PUT", "DELETE"))
        Assert.assertFalse(permitMatcher.authorizationsRules(path = "/api/square", method = "GET"))
    }


}