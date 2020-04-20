/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.security.constraint

import org.junit.Assert
import org.junit.Test

class DarwinSecurityConstraintsTest() {

    companion object {
        const val applicationId: String = "application-id"
    }

    @Test
    fun shouldLoadSecurityConstraints() {
        val darwinSecurityConstraints = DarwinSecurityConstraints()
        Assert.assertEquals(5, darwinSecurityConstraints.allMatcher().size)
    }

    @Test
    fun shouldPermitCircleToAdmin() {
        val darwinSecurityConstraints = DarwinSecurityConstraints()
        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenAdmin(),
                path = "/api/circle/134",
                method = "GET",
                applicationId = applicationId
            )
        )
        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenAdmin(),
                path = "/api/circle/135",
                method = "GET",
                applicationId = applicationId
            )
        )
        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenAdmin(),
                path = "/api/circle/134",
                method = "POST",
                applicationId = applicationId
            )
        )
        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenAdmin(),
                path = "/api/circle/1",
                method = "POST",
                applicationId = applicationId
            )
        )
        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenAdmin(),
                path = "/api/circle/444",
                method = "GET",
                applicationId = applicationId
            )
        )
    }

    @Test
    fun shouldNotPermitCircleToMooveRead() {
        val darwinSecurityConstraints = DarwinSecurityConstraints()
        Assert.assertFalse(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenMooveRead(),
                path = "/api/circle/134",
                method = "GET",
                applicationId = applicationId
            )
        )
        Assert.assertFalse(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenMooveRead(),
                path = "/api/circle/135",
                method = "GET",
                applicationId = applicationId
            )
        )
        Assert.assertFalse(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenMooveRead(),
                path = "/api/circle/134",
                method = "POST",
                applicationId = applicationId
            )
        )
        Assert.assertFalse(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenMooveRead(),
                path = "/api/circle/1",
                method = "POST",
                applicationId = applicationId
            )
        )
        Assert.assertFalse(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenMooveRead(),
                path = "/api/circle/444",
                method = "GET",
                applicationId = applicationId
            )
        )
    }

    @Test
    fun testAllRules() {
        val darwinSecurityConstraints = DarwinSecurityConstraints()
        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenAdmin(),
                path = "/api/circle/134",
                method = "GET",
                applicationId = applicationId
            )
        )
        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenAdmin(),
                path = "/api/circle/134",
                method = "POST",
                applicationId = applicationId
            )
        )

        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenMooveRead(),
                path = "/api/triangle",
                method = "GET",
                applicationId = applicationId
            )
        )

        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenMooveAndConfig(),
                path = "/api/triangle",
                method = "GET",
                applicationId = applicationId
            )
        )
        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenMooveAndConfig(),
                path = "/api/square/123",
                method = "GET",
                applicationId = applicationId
            )
        )
        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenMooveAndConfig(),
                path = "/api/square/123",
                method = "POST",
                applicationId = applicationId
            )
        )
        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenMooveAndConfig(),
                path = "/api/square/123",
                method = "DELETE",
                applicationId = applicationId
            )
        )
        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenMooveAndConfig(),
                path = "/api/square/123",
                method = "PUT",
                applicationId = applicationId
            )
        )

        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenAdmin(),
                path = "/api/rectangle",
                method = "GET",
                applicationId = applicationId
            )
        )
        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenMooveRead(),
                path = "/api/rectangle",
                method = "GET",
                applicationId = applicationId
            )
        )
        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenMooveAndConfig(),
                path = "/api/rectangle",
                method = "GET",
                applicationId = applicationId
            )
        )

        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenAdmin(),
                path = "/api/ellipse/123",
                method = "POST",
                applicationId = applicationId
            )
        )
        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenAdmin(),
                path = "/api/ellipse/134",
                method = "PUT",
                applicationId = applicationId
            )
        )
        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenMooveRead(),
                path = "/api/ellipse/123",
                method = "POST",
                applicationId = applicationId
            )
        )
        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenMooveRead(),
                path = "/api/ellipse/134",
                method = "PUT",
                applicationId = applicationId
            )
        )
        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenMooveAndConfig(),
                path = "/api/ellipse/123",
                method = "POST",
                applicationId = applicationId
            )
        )
        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenMooveAndConfig(),
                path = "/api/ellipse/134",
                method = "PUT",
                applicationId = applicationId
            )
        )
    }

    @Test(expected = SecurityConstraintsException::class)
    fun throwsExceptionWhenYamlIsNotValid() {
        DarwinSecurityConstraints("invalid-security-constraints.yml")
    }

    @Test
    fun shouldLoadOnlyPublic() {
        val darwinSecurityConstraints = DarwinSecurityConstraints("security-constraints-only-public.yml")
        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenAdmin(),
                path = "/api/circle/134",
                method = "GET",
                applicationId = applicationId
            )
        )
        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenAdmin(),
                path = "/api/circle/134",
                method = "POST",
                applicationId = applicationId
            )
        )

        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenMooveRead(),
                path = "/api/triangle",
                method = "GET",
                applicationId = applicationId
            )
        )

        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenMooveAndConfig(),
                path = "/api/triangle",
                method = "GET",
                applicationId = applicationId
            )
        )
        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenMooveAndConfig(),
                path = "/api/square/123",
                method = "GET",
                applicationId = applicationId
            )
        )
        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenMooveAndConfig(),
                path = "/api/square/123",
                method = "POST",
                applicationId = applicationId
            )
        )
        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenMooveAndConfig(),
                path = "/api/square/123",
                method = "DELETE",
                applicationId = applicationId
            )
        )
        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenMooveAndConfig(),
                path = "/api/square/123",
                method = "PUT",
                applicationId = applicationId
            )
        )

        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenAdmin(),
                path = "/api/rectangle",
                method = "GET",
                applicationId = applicationId
            )
        )
        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenMooveRead(),
                path = "/api/rectangle",
                method = "GET",
                applicationId = applicationId
            )
        )
        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenMooveAndConfig(),
                path = "/api/rectangle",
                method = "GET",
                applicationId = applicationId
            )
        )

        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenAdmin(),
                path = "/api/ellipse/123",
                method = "POST",
                applicationId = applicationId
            )
        )
        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenAdmin(),
                path = "/api/ellipse/134",
                method = "PUT",
                applicationId = applicationId
            )
        )
        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenMooveRead(),
                path = "/api/ellipse/123",
                method = "POST",
                applicationId = applicationId
            )
        )
        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenMooveRead(),
                path = "/api/ellipse/134",
                method = "PUT",
                applicationId = applicationId
            )
        )
        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenMooveAndConfig(),
                path = "/api/ellipse/123",
                method = "POST",
                applicationId = applicationId
            )
        )
        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = dummyTokenMooveAndConfig(),
                path = "/api/ellipse/134",
                method = "PUT",
                applicationId = applicationId
            )
        )

        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = null,
                path = "/api/ellipse/123",
                method = "POST",
                applicationId = applicationId
            )
        )
        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = null,
                path = "/api/ellipse/134",
                method = "PUT",
                applicationId = applicationId
            )
        )
        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = null,
                path = "/api/ellipse/123",
                method = "POST",
                applicationId = applicationId
            )
        )
        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = null,
                path = "/api/ellipse/134",
                method = "PUT",
                applicationId = applicationId
            )
        )
        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = null,
                path = "/api/ellipse/123",
                method = "POST",
                applicationId = applicationId
            )
        )
        Assert.assertTrue(
            darwinSecurityConstraints.validateToken(
                authorization = null,
                path = "/api/ellipse/134",
                method = "PUT",
                applicationId = applicationId
            )
        )
    }

    private fun dummyTokenAdmin() =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbnMiOlsiYXBwbGljYXRpb24taWQiXSwianRpIjoiMDM3OGJlY2UtZ" +
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

    private fun dummyTokenMooveRead() =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbnMiOlsiYXBwbGljYXRpb24taWQiXSwianRpIjoiMDM3OGJlY2UtZW" +
                "M1OC00NjEwLTg3NjctM2FiYWQxOTY2ODhkIiwiZXhwIjoxNTgxMzU4OTE1LCJuYmYiOjAsImlhdCI6MTU4MTM1NTMxNSwiaXNzI" +
                "joiaHR0cHM6Ly9kYXJ3aW4ta2V5Y2xvYWsuY29udGludW91c3BsYXRmb3JtLmNvbS9hdXRoL3JlYWxtcy9kYXJ3aW4iLCJhdWQi" +
                "OlsiZGFyd2luLWNsaWVudCIsImFjY291bnQiXSwic3ViIjoiOWIxYjRkYTktMDFkYS00ODk3LWE1YWItODFkMzM2YmY0OWZiIiw" +
                "idHlwIjoiQmVhcmVyIiwiYXpwIjoiZGFyd2luLWNsaWVudCIsImF1dGhfdGltZSI6MCwic2Vzc2lvbl9zdGF0ZSI6ImEzZDk1NT" +
                "FmLWQzNjktNDg0ZS04MTUzLThjYjBiN2RhNjAyNSIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiKiJdLCJyZWFsbV9hY" +
                "2Nlc3MiOnsicm9sZXMiOlsibW9vdmVfcmVhZCJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFu" +
                "YWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSBlbWF" +
                "pbCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwibmFtZSI6IkFkYXV0byBBZm9uc28gZGUgUGF1bGEiLCJwcmVmZXJyZWRfdXNlcm" +
                "5hbWUiOiJhZGF1dG8ucGF1bGFAenVwLmNvbS5iciIsImdpdmVuX25hbWUiOiJBZGF1dG8iLCJmYW1pbHlfbmFtZSI6IkFmb25zb" +
                "yBkZSBQYXVsYSIsImVtYWlsIjoiYWRhdXRvLnBhdWxhQHp1cC5jb20uYnIifQ.BGmvbDlNSnoroDw7T_5lTg_erkpIl2O-Be_s4" +
                "G-sjEs"

    private fun dummyTokenMooveAndConfig() =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbnMiOlsiYXBwbGljYXRpb24taWQiXSwianRpIjoiMDM3OGJlY2UtZWM" +
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