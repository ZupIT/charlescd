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
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.context.junit4.SpringRunner
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

@RunWith(SpringRunner::class)
@WebMvcTest(SecurityControllerTest::class)
@ContextConfiguration(classes = [DarwinSecurityConfiguration::class])
@ActiveProfiles(profiles = ["local"])
open class DarwinSecurityFilterDisabledTest {

    @Autowired
    lateinit var mvc: MockMvc


    @Test
    fun shouldResponse200WithoutAuthorizationForLocalProfile() {
        mvc.perform( MockMvcRequestBuilders
                .get("/api/circle/123456789")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk)
    }

    @Test
    fun shouldResponse200PostWithoutAuthorizationForLocalProfile() {
        mvc.perform( MockMvcRequestBuilders
                .post("/api/circle/123456789")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk)
    }

}