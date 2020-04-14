/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.security.constraint

import br.com.zup.darwin.security.config.Constants
import br.com.zup.darwin.security.utils.FileUtils
import org.springframework.stereotype.Component
import org.yaml.snakeyaml.Yaml
import org.yaml.snakeyaml.constructor.Constructor

@Component
class DarwinSecurityConstraints {

    constructor(file: String = Constants.SECURITY_CONSTRAINTS_FILE) {
        this.securityConstraints = loadMatchersFromFile(file)
    }

    constructor() {
        this.securityConstraints = loadMatchersFromFile(Constants.SECURITY_CONSTRAINTS_FILE)
    }

    private val yamlLoader = Yaml(Constructor(SecurityConstraints::class.java))
    private var securityConstraints: Set<Matcher>

    fun allMatcher() = securityConstraints

    private fun loadMatchersFromFile(configFileName: String): Set<Matcher> =
        loadYaml(configFileName)
            .allMatchers()
            .also { validateConstraints(it) }

    private fun validateConstraints(matchers: Set<Matcher>) {
        matchers.forEach { it.validate() }
    }

    private fun loadYaml(configFileName: String): SecurityConstraints =
        FileUtils.loadYamlFromFile(configFileName, yamlLoader)

    fun validateToken(authorization: String?, path: String, method: String, applicationId: String?) =
        securityConstraints.any {
            it.authorizationsRules(
                path = path,
                method = method,
                authorization = authorization,
                applicationId = applicationId
            )
        }
}