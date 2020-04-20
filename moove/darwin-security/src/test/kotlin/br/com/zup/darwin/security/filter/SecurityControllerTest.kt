/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.security.filter

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping

@Controller
class SecurityControllerTest {

    @GetMapping("/api/circle/{circle}")
    fun get(@PathVariable(value = "circle") circleId: String) : String = "SUCCESS for cicle ${circleId}"

    @PostMapping("/api/circle/{circle}")
    fun post(@PathVariable(value = "circle") circleId: String): String = "SUCCESS for cicle ${circleId}"

    @GetMapping("/api/rectangle")
    fun getRectangle() : String = "SUCCESS"

}