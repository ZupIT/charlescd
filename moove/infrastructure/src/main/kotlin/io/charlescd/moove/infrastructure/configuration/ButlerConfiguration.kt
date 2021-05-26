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
import org.slf4j.LoggerFactory
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
import java.security.cert.Certificate

import java.security.cert.CertificateFactory
import javax.net.ssl.SSLContext
import javax.net.ssl.SSLSocketFactory
import javax.net.ssl.TrustManagerFactory


@Configuration
class ButlerConfiguration(
    @Value("\${tls.key}")
    val certKey: String,
    @Value("\${tls.cert}")
    val cert: String
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
        logger.info("Cert: ${this.cert}")
        val cf: CertificateFactory = CertificateFactory.getInstance("X.509")
        val certStream: InputStream = ByteArrayInputStream(this.cert.toByteArray());
        val root = cf.generateCertificate(certStream)
        val keyStoreType = KeyStore.getDefaultType();

        //Save Butler ca on key store
        logger.info("Saving butler ca", root)
        val keyStore = KeyStore.getInstance(keyStoreType);
        keyStore.load(null, null);
        keyStore.setCertificateEntry("ca", root);
        //Set that the butler ca is a trusted certificate
        val tmfAlgorithm = TrustManagerFactory.getDefaultAlgorithm();
        val tmf = TrustManagerFactory.getInstance(tmfAlgorithm);
        tmf.init(keyStore);
        logger.info("butler ca  is trusted ${root}", root)
        //Init context
        val context = SSLContext.getInstance("TLS");
        context.init(null, tmf.trustManagers, null);
        return context.socketFactory
    }
}
