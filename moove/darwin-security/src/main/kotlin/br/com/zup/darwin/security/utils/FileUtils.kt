/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.security.utils

import br.com.zup.darwin.security.InvalidYamlException
import org.yaml.snakeyaml.Yaml
import java.net.URL

object FileUtils {
    fun loadFromFile(fileName: String) =
            this.javaClass.classLoader.getResource(fileName) ?: throw IllegalStateException("File not found: $fileName")

    fun <T> loadYamlFromFile(fileName: String, yamlLoader: Yaml): T =
            loadFromFile(fileName).let { loadYaml(it, yamlLoader) }

    private fun <T> loadYaml(src: URL, yamlLoader: Yaml): T =
            try {
                yamlLoader.load<T>(src.openStream())
            } catch (ex: Exception) {
                throw InvalidYamlException("Could not load ${src.path}", ex)
            }
}