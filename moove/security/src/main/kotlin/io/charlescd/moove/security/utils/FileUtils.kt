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

package io.charlescd.moove.security.utils

import io.charlescd.moove.security.InvalidYamlException
import org.yaml.snakeyaml.Yaml
import java.net.URL

object FileUtils {
    fun loadFromFile(fileName: String, map: Yaml) =
        this.javaClass.classLoader.getResource(fileName) ?: throw IllegalStateException("File not found: $fileName")

    fun <T> loadYamlFromFile(fileName: String, yamlLoader: Yaml): T =
        loadFromFile(fileName, yamlLoader)
            .let { loadYaml(it, yamlLoader) }

    private fun <T> loadYaml(src: URL, yamlLoader: Yaml): T =
        try {
            yamlLoader.load<T>(src.openStream())
        } catch (ex: Exception) {
            throw InvalidYamlException("Could not load ${src.path}", ex)
        }
}
