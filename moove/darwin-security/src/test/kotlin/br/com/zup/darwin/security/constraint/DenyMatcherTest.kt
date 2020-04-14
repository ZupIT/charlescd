/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.security.constraint

import org.junit.Assert
import org.junit.Test

class DenyMatcherTest {

    companion object {
        const val applicationId = "application-id"
    }

    @Test
    fun shouldAuthorizationsRules() {
        val denyMatcher = DenyMatcher(pattern = "/api/square", roles = dummyRole())
        Assert.assertTrue(
            denyMatcher.authorizationsRules(
                path = "/api/square",
                method = "GET",
                authorization = dummyAuthorizationAdmin(),
                applicationId = applicationId
            )
        )
        Assert.assertTrue(
            denyMatcher.authorizationsRules(
                path = "/api/square",
                method = "POST",
                authorization = dummyAuthorizationAdmin(),
                applicationId = applicationId
            )
        )
        Assert.assertTrue(
            denyMatcher.authorizationsRules(
                path = "/api/square",
                method = "GET",
                authorization = dummyAuthorizationAdmin(),
                applicationId = applicationId
            )
        )
        Assert.assertFalse(
            denyMatcher.authorizationsRules(
                path = "/api/square",
                method = "POST",
                authorization = dummyAuthorizationMoove(),
                applicationId = applicationId
            )
        )
    }

    @Test
    fun shouldNotAuthorizationsRulesForMoove() {
        val denyMatcher = DenyMatcher(pattern = "/api/square", roles = dummyRole())
        Assert.assertFalse(
            denyMatcher.authorizationsRules(
                path = "/api/square",
                method = "GET",
                authorization = dummyAuthorizationMoove(),
                applicationId = applicationId
            )
        )
    }

    @Test
    fun shouldNotAuthorizationsRulesWithoutRule() {
        val denyMatcher = DenyMatcher(pattern = "/api/square", roles = dummyRole())
        Assert.assertFalse(
            denyMatcher.authorizationsRules(
                path = "/api/square",
                method = "GET",
                authorization = dummyAuthorizationMoove(),
                applicationId = applicationId
            )
        )
    }


    @Test
    fun shouldNotAuthorizationsRulesForPut() {
        val denyMatcher = DenyMatcher(pattern = "/api/square", roles = dummyRole())
        Assert.assertFalse(
            denyMatcher.authorizationsRules(
                path = "/api/square",
                method = "PUT",
                authorization = dummyAuthorizationAdmin(),
                applicationId = applicationId
            )
        )
    }


    @Test
    fun shouldAuthorizationsRulesForVersion() {
        val denyMatcher = DenyMatcher(pattern = "/v{\\d+}/api/square", roles = dummyRole())
        Assert.assertTrue(
            denyMatcher.authorizationsRules(
                path = "/v1/api/square",
                method = "GET",
                authorization = dummyAuthorizationAdmin(),
                applicationId = applicationId
            )
        )
    }

    @Test
    fun shouldAuthorizationsRulesRegexParams() {
        val denyMatcher = DenyMatcher(pattern = "/api/{param}", roles = dummyRole())
        Assert.assertTrue(
            denyMatcher.authorizationsRules(
                path = "/api/square",
                method = "GET",
                authorization = dummyAuthorizationAdmin(),
                applicationId = applicationId
            )
        )
    }

    @Test
    fun shouldAuthorizationsRulesRegexAny() {
        val denyMatcher = DenyMatcher(pattern = "/api/*", roles = dummyRole())
        Assert.assertTrue(
            denyMatcher.authorizationsRules(
                path = "/api/square",
                method = "GET",
                authorization = dummyAuthorizationAdmin(),
                applicationId = applicationId
            )
        )
    }

    @Test
    fun shouldAuthorizationsRulesRegexAnyAny() {
        val denyMatcher = DenyMatcher(pattern = "/api/**", roles = dummyRole())
        Assert.assertTrue(
            denyMatcher.authorizationsRules(
                path = "/api/square/1/2/3",
                method = "GET",
                authorization = dummyAuthorizationAdmin(),
                applicationId = applicationId
            )
        )
    }

    @Test
    fun shouldAuthorizationsRulesMiddleRegex() {
        val denyMatcher = DenyMatcher(pattern = "/api/*/end", roles = dummyRole())
        Assert.assertTrue(
            denyMatcher.authorizationsRules(
                path = "/api/square/end",
                method = "GET",
                authorization = dummyAuthorizationAdmin(),
                applicationId = applicationId
            )
        )
    }

    @Test
    fun shouldNotAuthorizationsRules() {
        val denyMatcher = DenyMatcher(pattern = "/api/squar", roles = dummyRole())
        Assert.assertFalse(
            denyMatcher.authorizationsRules(
                path = "/api/square",
                method = "GET",
                authorization = dummyAuthorizationAdmin(),
                applicationId = applicationId
            )
        )
    }

    @Test
    fun shouldNotAuthorizationsRulesForVersion() {
        val denyMatcher = DenyMatcher(pattern = "/v{\\d+}/api/square", roles = dummyRole())
        Assert.assertFalse(
            denyMatcher.authorizationsRules(
                path = "/test/api/square",
                method = "GET",
                authorization = dummyAuthorizationAdmin(),
                applicationId = applicationId
            )
        )
    }

    @Test
    fun shouldNotAuthorizationsRulesRegexParams() {
        val denyMatcher = DenyMatcher(pattern = "/api/{param}", roles = dummyRole())
        Assert.assertFalse(
            denyMatcher.authorizationsRules(
                path = "/api/square/end",
                method = "GET",
                authorization = dummyAuthorizationAdmin(),
                applicationId = applicationId
            )
        )
    }

    @Test
    fun shouldNotAuthorizationsRulesRegexAny() {
        val denyMatcher = DenyMatcher(pattern = "/api/*", roles = dummyRole())
        Assert.assertFalse(
            denyMatcher.authorizationsRules(
                path = "/api",
                method = "GET",
                authorization = dummyAuthorizationAdmin(),
                applicationId = applicationId
            )
        )
    }

    @Test
    fun shouldNotAuthorizationsRulesMiddleRegex() {
        val denyMatcher = DenyMatcher(pattern = "/api/*/end", roles = dummyRole())
        Assert.assertFalse(
            denyMatcher.authorizationsRules(
                path = "/api/square",
                method = "GET",
                authorization = dummyAuthorizationAdmin(),
                applicationId = applicationId
            )
        )
    }


    private fun dummyRole() = linkedMapOf(Pair("admin", listOf("GET", "POST")), Pair("user", listOf("GET")))

    private fun dummyAuthorizationAdmin() =
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbnMiOlsiYXBwbGljYXRpb24taWQiXSwianRpIjoiMDM3OGJlY2UtZ" +
                "WM1OC00NjEwLTg3NjctM2FiYWQxOTY2ODhkIiwiZXhwIjoxNTgxMzU4OTE1LCJuYmYiOjAsImlhdCI6MTU4MTM1NTMxNSwiaXN" +
                "zIjoiaHR0cHM6Ly9kYXJ3aW4ta2V5Y2xvYWsuY29udGludW91c3BsYXRmb3JtLmNvbS9hdXRoL3JlYWxtcy9kYXJ3aW4iLCJhd" +
                "WQiOlsiZGFyd2luLWNsaWVudCIsImFjY291bnQiXSwic3ViIjoiOWIxYjRkYTktMDFkYS00ODk3LWE1YWItODFkMzM2YmY0OWZ" +
                "iIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiZGFyd2luLWNsaWVudCIsImF1dGhfdGltZSI6MCwic2Vzc2lvbl9zdGF0ZSI6ImEzZ" +
                "Dk1NTFmLWQzNjktNDg0ZS04MTUzLThjYjBiN2RhNjAyNSIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiKiJdLCJyZWF" +
                "sbV9hY2Nlc3MiOnsicm9sZXMiOlsibW9vdmVfcmVhZCIsImNvbmZpZ193cml0ZSIsImFkbWluIiwiY2lyY2xlX3JlYWQiLCJja" +
                "XJjbGVfd3JpdGUiLCJtb2R1bGVfcmVhZCIsImJ1aWxkX3JlYWQiLCJkZXBsb3lfcmVhZCIsImRlcGxveV93cml0ZSIsImJ1aWx" +
                "kX3dyaXRlIiwib2ZmbGluZV9hY2Nlc3MiLCJjb25maWdfcmVhZCIsIm1vZHVsZV93cml0ZSIsInVtYV9hdXRob3JpemF0aW9uI" +
                "iwibW9vdmVfd3JpdGUiXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50Iiw" +
                "ibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6InByb2ZpbGUgZW1haWwiLCJlbWFpbF92Z" +
                "XJpZmllZCI6ZmFsc2UsIm5hbWUiOiJBZGF1dG8gQWZvbnNvIGRlIFBhdWxhIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiYWRhdXR" +
                "vLnBhdWxhQHp1cC5jb20uYnIiLCJnaXZlbl9uYW1lIjoiQWRhdXRvIiwiZmFtaWx5X25hbWUiOiJBZm9uc28gZGUgUGF1bGEiL" +
                "CJlbWFpbCI6ImFkYXV0by5wYXVsYUB6dXAuY29tLmJyIn0.4NLwg7f_JTU2LhAXY75j_wYOxU_FZmvuYTTbp1xab6E"

    private fun dummyAuthorizationMoove() =
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbnMiOlsiYXBwbGljYXRpb24taWQiXSwianRpIjoiMDM3OGJlY2UtZWM" +
                "1OC00NjEwLTg3NjctM2FiYWQxOTY2ODhkIiwiZXhwIjoxNTgxMzU4OTE1LCJuYmYiOjAsImlhdCI6MTU4MTM1NTMxNSwiaXNzIjo" +
                "iaHR0cHM6Ly9kYXJ3aW4ta2V5Y2xvYWsuY29udGludW91c3BsYXRmb3JtLmNvbS9hdXRoL3JlYWxtcy9kYXJ3aW4iLCJhdWQiOls" +
                "iZGFyd2luLWNsaWVudCIsImFjY291bnQiXSwic3ViIjoiOWIxYjRkYTktMDFkYS00ODk3LWE1YWItODFkMzM2YmY0OWZiIiwidHl" +
                "wIjoiQmVhcmVyIiwiYXpwIjoiZGFyd2luLWNsaWVudCIsImF1dGhfdGltZSI6MCwic2Vzc2lvbl9zdGF0ZSI6ImEzZDk1NTFmLWQ" +
                "zNjktNDg0ZS04MTUzLThjYjBiN2RhNjAyNSIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiKiJdLCJyZWFsbV9hY2Nlc3M" +
                "iOnsicm9sZXMiOlsibW9vdmVfcmVhZCIsImNvbmZpZ193cml0ZSIsImNvbmZpZ19yZWFkIiwibW9vdmVfd3JpdGUiXX0sInJlc29" +
                "1cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ" +
                "2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6InByb2ZpbGUgZW1haWwiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsIm5hbWUiOiJBZGF" +
                "1dG8gQWZvbnNvIGRlIFBhdWxhIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiYWRhdXRvLnBhdWxhQHp1cC5jb20uYnIiLCJnaXZlbl9" +
                "uYW1lIjoiQWRhdXRvIiwiZmFtaWx5X25hbWUiOiJBZm9uc28gZGUgUGF1bGEiLCJlbWFpbCI6ImFkYXV0by5wYXVsYUB6dXAuY29" +
                "tLmJyIn0.uQPAuqVASJw85Iiw6NL9TglfYbESdBRvVhNL8l4GR1A"

}