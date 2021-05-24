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
import feign.Logger
import feign.codec.Encoder
import feign.codec.ErrorDecoder
import feign.form.FormEncoder
import org.apache.http.conn.ssl.NoopHostnameVerifier
import org.apache.http.ssl.SSLContextBuilder
import org.springframework.beans.factory.ObjectFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.autoconfigure.http.HttpMessageConverters
import org.springframework.cloud.openfeign.support.SpringEncoder
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Scope
import java.io.ByteArrayInputStream
import java.io.InputStream
import java.security.KeyStore

import java.security.cert.CertificateFactory
import javax.net.ssl.SSLSocketFactory


@Configuration
class ButlerConfiguration(
    val messageConverters: ObjectFactory<HttpMessageConverters>,
    @Value("\${tls.key}")
    val certKey: String,
    @Value("\${tls.cert}")
    val cert: String
) {

    @Bean
    fun simpleFeignLogger(): Logger.Level {
        return Logger.Level.FULL
    }

    @Bean
    @Scope("prototype")
    fun simpleFeignFormEncoder(): Encoder {
        return FormEncoder(SpringEncoder(messageConverters))
    }

    @Bean
    fun simpleErrorDecoder(): ErrorDecoder {
        return CustomFeignErrorDecoder()
    }
    @Bean
    fun feignClient(): Client {
        val trustSSLSockets = Client.Default(getSSLSocketFactory(),  NoopHostnameVerifier());
        return trustSSLSockets;
    }

    fun getSSLSocketFactory(): SSLSocketFactory {
        val password = "charlesadmin"
        val cf: CertificateFactory = CertificateFactory.getInstance("X.509")
        val certStream: InputStream = ByteArrayInputStream(this.cert.toByteArray());
        val root = cf.generateCertificate(certStream)
        val pkcs12: KeyStore = KeyStore.getInstance("PKCS12")
        pkcs12.setCertificateEntry("root", root)
        val sslContext = SSLContextBuilder.create()
            .loadKeyMaterial(pkcs12, password.toCharArray())
            .build();
        return sslContext.socketFactory
    }
}
