/*
 * Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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

package io.charlescd.moove.infrastructure.configuration

import feign.Client
import feign.Feign
import feign.okhttp.OkHttpClient
import org.apache.http.ssl.SSLContexts
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.io.ResourceLoader
import javax.net.ssl.SSLSocketFactory

@Configuration
class ButlerEncoderConfiguration(
    @Value("\${key.store.password}")
    val keyStorePassword: String,
    @Value("\${butler.tls.store.path}")
    val butlerStorePath: String,
    @Value("\${moove.tls.store.path}")
    val mooveStorePath: String,
    @Value("\${mtls.enabled:false}")
    val mtlsEnabled: Boolean,
    val resourceLoader: ResourceLoader
) {

    @Bean
    fun butlerErrorDecoder(): ButlerErrorDecoder {
        return ButlerErrorDecoder()
    }

    @Bean
    fun feignClient(): Client {
        return when (mtlsEnabled) {
            true -> Client.Default(getSSLSocketFactory(), null)
            else -> OkHttpClient()
        }
    }

    fun getSSLSocketFactory(): SSLSocketFactory {
        val mooveStore = loadFromFile(mooveStorePath)
        val butlerKeyStore = loadFromFile(butlerStorePath)
        val sslContext = SSLContexts.custom().loadKeyMaterial(
            mooveStore.file, keyStorePassword.toCharArray(), keyStorePassword.toCharArray()
        ).loadTrustMaterial(
            butlerKeyStore.file, keyStorePassword.toCharArray()
        ).build()

        return sslContext.socketFactory
    }

    fun loadFromFile(fileName: String) =
        this.resourceLoader.getResource("file:///$fileName") ?: throw IllegalStateException("File not found: $fileName")
}
