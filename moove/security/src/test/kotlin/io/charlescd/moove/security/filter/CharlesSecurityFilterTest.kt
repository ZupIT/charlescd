/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.charlescd.moove.security.filter

import io.charlescd.moove.security.config.CharlesSecurityConfiguration
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
@ContextConfiguration(classes = [CharlesSecurityConfiguration::class])
open class CharlesSecurityFilterTest {

    companion object {
        const val workspaceId = "workspace-id"
    }

    @Autowired
    lateinit var mvc: MockMvc

    @Test
    fun shouldResponse200() {
        mvc.perform(
            MockMvcRequestBuilders
                .get("/api/circle/123456789")
                .header("Authorization", "Bearer ${dummyTokenRoot()}")
                .header("x-workspace-id",
                    workspaceId
                )
                .accept(MediaType.APPLICATION_JSON)
        )
            .andExpect(MockMvcResultMatchers.status().isOk)
    }

    @Test
    fun shouldResponse200Post() {
        mvc.perform(
            MockMvcRequestBuilders
                .post("/api/circle/123456789")
                .header("Authorization", "Bearer ${dummyTokenRoot()}")
                .header("x-workspace-id",
                    workspaceId
                )
                .accept(MediaType.APPLICATION_JSON)
        )
            .andExpect(MockMvcResultMatchers.status().isOk)
    }

    @Test
    fun shouldResponse403() {
        mvc.perform(
            MockMvcRequestBuilders
                .get("/api/circle/123456789")
                .header("x-workspace-id",
                    workspaceId
                )
                .accept(MediaType.APPLICATION_JSON)
        )
            .andExpect(MockMvcResultMatchers.status().isForbidden)
    }

    @Test
    fun shouldResponse404() {
        mvc.perform(
            MockMvcRequestBuilders
                .get("/api/triangle")
                .header("Authorization", "Bearer ${dummyTokenModulesRead()}")
                .header("x-workspace-id",
                    workspaceId
                )
                .accept(MediaType.APPLICATION_JSON)
        )
            .andExpect(MockMvcResultMatchers.status().isNotFound)
    }

    @Test
    fun shouldResponse403ForMooveAndConfig() {
        mvc.perform(
            MockMvcRequestBuilders
                .get("/api/circle/123456789")
                .header("Authorization", "Bearer ${dummyTokenMaintenanceAndModules()}")
                .header("x-workspace-id",
                    workspaceId
                )
                .accept(MediaType.APPLICATION_JSON)
        )
            .andExpect(MockMvcResultMatchers.status().isForbidden)
    }

    @Test
    fun shouldResponse200PublicRouteToRoot() {
        mvc.perform(
            MockMvcRequestBuilders
                .get("/api/rectangle")
                .header("Authorization", "Bearer ${dummyTokenRoot()}")
                .header("x-workspace-id",
                    workspaceId
                )
                .accept(MediaType.APPLICATION_JSON)
        )
            .andExpect(MockMvcResultMatchers.status().isOk)
    }

    @Test
    fun shouldResponse200PublicRouteToMoove() {
        mvc.perform(
            MockMvcRequestBuilders
                .get("/api/rectangle")
                .header("Authorization", "Bearer ${dummyTokenModulesRead()}")
                .header("x-workspace-id",
                    workspaceId
                )
                .accept(MediaType.APPLICATION_JSON)
        )
            .andExpect(MockMvcResultMatchers.status().isOk)
    }

    @Test
    fun shouldResponse200PublicRouteToMooveAndConfig() {
        mvc.perform(
            MockMvcRequestBuilders
                .get("/api/rectangle")
                .header("Authorization", "Bearer ${dummyTokenMaintenanceAndModules()}")
                .header("x-workspace-id",
                    workspaceId
                )
                .accept(MediaType.APPLICATION_JSON)
        )
            .andExpect(MockMvcResultMatchers.status().isOk)
    }

    @Test
    fun shouldResponse200PrivateRouteToRoot() {
        mvc.perform(
            MockMvcRequestBuilders
                .post("/api/square/123456")
                .header("Authorization", "Bearer ${dummyTokenRoot()}")
                .header("x-workspace-id",
                    workspaceId
                )
                .accept(MediaType.APPLICATION_JSON)
        )
            .andExpect(MockMvcResultMatchers.status().isNotFound)
    }

    @Test
    fun shouldResponse200ForPublicRouteWithoutAuthorization() {
        mvc.perform(
            MockMvcRequestBuilders
                .get("/api/rectangle")
                .accept(MediaType.APPLICATION_JSON)
        )
            .andExpect(MockMvcResultMatchers.status().isOk)
    }

    private fun dummyTokenRoot() =
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIwMzc4YmVjZS1lYzU4LTQ2MTAtODc2Ny0zYWJhZDE5NjY4OGQiLCJleHAiOj" +
                "E1ODgxOTI0MzEsIm5iZiI6MCwiaWF0IjoxNTgxMzU1MzE1LCJpc3MiOiJodHRwczovL2Rhcndpbi1rZXljbG9hay5jb250aW51b" +
                "3VzcGxhdGZvcm0uY29tL2F1dGgvcmVhbG1zL2RhcndpbiIsImF1ZCI6WyJkYXJ3aW4tY2xpZW50IiwiYWNjb3VudCJdLCJzdWIi" +
                "OiI5YjFiNGRhOS0wMWRhLTQ4OTctYTVhYi04MWQzMzZiZjQ5ZmIiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJkYXJ3aW4tY2xpZW5" +
                "0IiwiYXV0aF90aW1lIjowLCJzZXNzaW9uX3N0YXRlIjoiYTNkOTU1MWYtZDM2OS00ODRlLTgxNTMtOGNiMGI3ZGE2MDI1IiwiYW" +
                "NyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyIqIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJtb292ZV9yZWFkIiwiY29uZ" +
                "mlnX3dyaXRlIiwiYWRtaW4iLCJjaXJjbGVfcmVhZCIsImNpcmNsZV93cml0ZSIsIm1vZHVsZV9yZWFkIiwiYnVpbGRfcmVhZCIs" +
                "ImRlcGxveV9yZWFkIiwiZGVwbG95X3dyaXRlIiwiYnVpbGRfd3JpdGUiLCJvZmZsaW5lX2FjY2VzcyIsImNvbmZpZ19yZWFkIiw" +
                "ibW9kdWxlX3dyaXRlIiwidW1hX2F1dGhvcml6YXRpb24iLCJtb292ZV93cml0ZSJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY2" +
                "91bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sI" +
                "mlzUm9vdCI6dHJ1ZSwic2NvcGUiOiJwcm9maWxlIGVtYWlsIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJuYW1lIjoiQWRhdXRv" +
                "IEFmb25zbyBkZSBQYXVsYSIsInByZWZlcnJlZF91c2VybmFtZSI6ImFkYXV0by5wYXVsYUB6dXAuY29tLmJyIiwiZ2l2ZW5fbmF" +
                "tZSI6IkFkYXV0byIsImZhbWlseV9uYW1lIjoiQWZvbnNvIGRlIFBhdWxhIiwiZW1haWwiOiJhZGF1dG8ucGF1bGFAenVwLmNvbS" +
                "5iciJ9.y2KK5XLvOHkMbJCDkDcdY1495oCHcSmcKNIDjKR5edY"

    private fun dummyTokenModulesRead() =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3b3Jrc3BhY2VzIjpbeyJpZCI6IndvcmtzcGFjZS1pZCIsInBlcm1pc3Npb25zIjpbIm" +
                "1vZHVsZXNfcmVhZCJdfV0sImlzUm9vdCI6ZmFsc2UsImp0aSI6IjAzNzhiZWNlLWVjNTgtNDYxMC04NzY3LTNhYmFkMTk2Njg4Z" +
                "CIsImV4cCI6MTU4MTM1ODkxNSwibmJmIjowLCJpYXQiOjE1ODEzNTUzMTUsImlzcyI6Imh0dHBzOi8vZGFyd2luLWtleWNsb2Fr" +
                "LmNvbnRpbnVvdXNwbGF0Zm9ybS5jb20vYXV0aC9yZWFsbXMvZGFyd2luIiwiYXVkIjpbImRhcndpbi1jbGllbnQiLCJhY2NvdW5" +
                "0Il0sInN1YiI6IjliMWI0ZGE5LTAxZGEtNDg5Ny1hNWFiLTgxZDMzNmJmNDlmYiIsInR5cCI6IkJlYXJlciIsImF6cCI6ImRhcn" +
                "dpbi1jbGllbnQiLCJhdXRoX3RpbWUiOjAsInNlc3Npb25fc3RhdGUiOiJhM2Q5NTUxZi1kMzY5LTQ4NGUtODE1My04Y2IwYjdkY" +
                "TYwMjUiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbIioiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm1vb3ZlX3Jl" +
                "YWQiXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY29" +
                "1bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6InByb2ZpbGUgZW1haWwiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2" +
                "UsIm5hbWUiOiJBZGF1dG8gQWZvbnNvIGRlIFBhdWxhIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiYWRhdXRvLnBhdWxhQHp1cC5jb" +
                "20uYnIiLCJnaXZlbl9uYW1lIjoiQWRhdXRvIiwiZmFtaWx5X25hbWUiOiJBZm9uc28gZGUgUGF1bGEiLCJlbWFpbCI6ImFkYXV0" +
                "by5wYXVsYUB6dXAuY29tLmJyIn0.ao9M53qYvT_peQ1191ecVql1F0-oCgGBmHntZX2GFAU"

    private fun dummyTokenMaintenanceAndModules() =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3b3Jrc3BhY2VzIjpbeyJpZCI6IndvcmtzcGFjZS1pZCIsInBlcm1pc3Npb25zIjpbIm" +
                "1vZHVsZXNfcmVhZCIsIm1haW50ZW5hbmNlX3dyaXRlIl19XSwiaXNSb290IjpmYWxzZSwianRpIjoiMDM3OGJlY2UtZWM1OC00N" +
                "jEwLTg3NjctM2FiYWQxOTY2ODhkIiwiZXhwIjoxNTgxMzU4OTE1LCJuYmYiOjAsImlhdCI6MTU4MTM1NTMxNSwiaXNzIjoiaHR0" +
                "cHM6Ly9kYXJ3aW4ta2V5Y2xvYWsuY29udGludW91c3BsYXRmb3JtLmNvbS9hdXRoL3JlYWxtcy9kYXJ3aW4iLCJhdWQiOlsiZGF" +
                "yd2luLWNsaWVudCIsImFjY291bnQiXSwic3ViIjoiOWIxYjRkYTktMDFkYS00ODk3LWE1YWItODFkMzM2YmY0OWZiIiwidHlwIj" +
                "oiQmVhcmVyIiwiYXpwIjoiZGFyd2luLWNsaWVudCIsImF1dGhfdGltZSI6MCwic2Vzc2lvbl9zdGF0ZSI6ImEzZDk1NTFmLWQzN" +
                "jktNDg0ZS04MTUzLThjYjBiN2RhNjAyNSIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiKiJdLCJyZWFsbV9hY2Nlc3Mi" +
                "Onsicm9sZXMiOlsibW9vdmVfcmVhZCJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWF" +
                "jY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsIm" +
                "VtYWlsX3ZlcmlmaWVkIjpmYWxzZSwibmFtZSI6IkFkYXV0byBBZm9uc28gZGUgUGF1bGEiLCJwcmVmZXJyZWRfdXNlcm5hbWUiO" +
                "iJhZGF1dG8ucGF1bGFAenVwLmNvbS5iciIsImdpdmVuX25hbWUiOiJBZGF1dG8iLCJmYW1pbHlfbmFtZSI6IkFmb25zbyBkZSBQ" +
                "YXVsYSIsImVtYWlsIjoiYWRhdXRvLnBhdWxhQHp1cC5jb20uYnIifQ.r_9nadOCYu-nj6r_NDEhySUOvE6owvUeUFoK2Xsaz-k"
}
