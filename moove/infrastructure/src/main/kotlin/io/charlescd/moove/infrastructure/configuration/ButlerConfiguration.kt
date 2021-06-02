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

package io.charlescd.moove.infrastructure.configuration

import feign.Client
import feign.codec.ErrorDecoder
import org.apache.http.conn.ssl.NoopHostnameVerifier
import org.apache.http.ssl.SSLContexts
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.io.Resource
import java.security.KeyStore
import javax.net.ssl.SSLSocketFactory


@Configuration
class ButlerConfiguration(
    @Value("\${key.store.password}")
    val keyStorePassword: String,
    @Value("\${butler.tls.store.path}")
    val butlerStorePath: String,
    @Value("\${moove.tls.store.path}")
    val mooveStorePath: String
) {
    private val logger = LoggerFactory.getLogger(this.javaClass)
    @Bean
    fun butlerErrorDecoder(): ErrorDecoder {
        return CustomFeignErrorDecoder()
    }
    @Bean
    fun feignClient(): Client {
        val trustSSLSockets = Client.Default(getSSLSocketFactory(),  NoopHostnameVerifier());
        return trustSSLSockets;
    }

    fun getSSLSocketFactory(): SSLSocketFactory {
        val mooveStore = loadFromFile(mooveStorePath)
        val butlerKeyStore = loadFromFile(butlerStorePath)
        val sslContext = SSLContexts.custom().loadKeyMaterial(
            mooveStore,keyStorePassword.toCharArray(), keyStorePassword.toCharArray()
        ).loadTrustMaterial(
            butlerKeyStore, keyStorePassword.toCharArray()
        ).build()
        return sslContext.socketFactory
    }

    fun loadFromFile(fileName: String) =
        this.javaClass.classLoader.getResource("file:///$fileName") ?: throw IllegalStateException("File not found: $fileName")
}
