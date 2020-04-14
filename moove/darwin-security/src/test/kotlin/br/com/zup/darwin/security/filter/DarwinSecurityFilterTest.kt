/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.security.filter

import br.com.zup.darwin.security.config.DarwinSecurityConfiguration
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.http.MediaType
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.context.junit4.SpringRunner
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

@RunWith(SpringRunner::class)
@WebMvcTest(SecurityControllerTest::class)
@ContextConfiguration(classes = [DarwinSecurityConfiguration::class])
open class DarwinSecurityFilterTest {

    companion object {
        const val applicationId = "application-id"
    }

    @Autowired
    lateinit var mvc: MockMvc

    @Test
    fun shouldResponse200() {
        mvc.perform(
            MockMvcRequestBuilders
                .get("/api/circle/123456789")
                .header("Authorization", "Bearer ${dummyTokenAdmin()}")
                .header("x-application-id", applicationId)
                .accept(MediaType.APPLICATION_JSON)
        )
            .andExpect(MockMvcResultMatchers.status().isOk)
    }

    @Test
    fun shouldResponse200Post() {
        mvc.perform(
            MockMvcRequestBuilders
                .post("/api/circle/123456789")
                .header("Authorization", "Bearer ${dummyTokenAdmin()}")
                .header("x-application-id", applicationId)
                .accept(MediaType.APPLICATION_JSON)
        )
            .andExpect(MockMvcResultMatchers.status().isOk)
    }

    @Test
    fun shouldResponse401() {
        mvc.perform(
            MockMvcRequestBuilders
                .get("/api/circle/123456789")
                .header("x-application-id", applicationId)
                .accept(MediaType.APPLICATION_JSON)
        )
            .andExpect(MockMvcResultMatchers.status().isUnauthorized)
    }

    @Test
    fun shouldResponse404() {
        mvc.perform(
            MockMvcRequestBuilders
                .get("/api/triangle")
                .header("Authorization", "Bearer ${dummyTokenMooveRead()}")
                .header("x-application-id", applicationId)
                .accept(MediaType.APPLICATION_JSON)
        )
            .andExpect(MockMvcResultMatchers.status().isNotFound)
    }

    @Test
    fun shouldResponse401ForMooveAndConfig() {
        mvc.perform(
            MockMvcRequestBuilders
                .get("/api/circle/123456789")
                .header("Authorization", "Bearer ${dummyTokenMooveAndConfig()}")
                .header("x-application-id", applicationId)
                .accept(MediaType.APPLICATION_JSON)
        )
            .andExpect(MockMvcResultMatchers.status().isUnauthorized)
    }

    @Test
    fun shouldResponse200PublicRouteToAdmin() {
        mvc.perform(
            MockMvcRequestBuilders
                .get("/api/rectangle")
                .header("Authorization", "Bearer ${dummyTokenAdmin()}")
                .header("x-application-id", applicationId)
                .accept(MediaType.APPLICATION_JSON)
        )
            .andExpect(MockMvcResultMatchers.status().isOk)
    }

    @Test
    fun shouldResponse200PublicRouteToMoove() {
        mvc.perform(
            MockMvcRequestBuilders
                .get("/api/rectangle")
                .header("Authorization", "Bearer ${dummyTokenMooveRead()}")
                .header("x-application-id", applicationId)
                .accept(MediaType.APPLICATION_JSON)
        )
            .andExpect(MockMvcResultMatchers.status().isOk)
    }

    @Test
    fun shouldResponse200PublicRouteToMooveAndConfig() {
        mvc.perform(
            MockMvcRequestBuilders
                .get("/api/rectangle")
                .header("Authorization", "Bearer ${dummyTokenMooveAndConfig()}")
                .header("x-application-id", applicationId)
                .accept(MediaType.APPLICATION_JSON)
        )
            .andExpect(MockMvcResultMatchers.status().isOk)
    }

    @Test
    fun shouldResponse404PublicRouteToAdmin() {
        mvc.perform(
            MockMvcRequestBuilders
                .post("/api/ellipse/123456")
                .header("Authorization", "Bearer ${dummyTokenAdmin()}")
                .header("x-application-id", applicationId)
                .accept(MediaType.APPLICATION_JSON)
        )
            .andExpect(MockMvcResultMatchers.status().isNotFound)
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