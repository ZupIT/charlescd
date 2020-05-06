/*
 *  Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */

package br.com.zup.tracing.zuptracing.configuration;


import br.com.zup.tracing.zuptracing.decorator.ZupJaegerSpanDecorator;
import io.jaegertracing.internal.propagation.TextMapCodec;
import io.opentracing.contrib.java.spring.jaeger.starter.TracerBuilderCustomizer;
import io.opentracing.contrib.web.servlet.filter.ServletFilterSpanDecorator;
import io.opentracing.propagation.Format;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.AutoConfigureBefore;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableFeignClients
@ConditionalOnProperty(value = "zup.tracing.enable", havingValue = "true", matchIfMissing = true)
@AutoConfigureBefore(name = "io.opentracing.contrib.java.spring.jaeger.starter.JaegerAutoConfiguration")
public class ZupTracingAutoConfiguration {

    private TextMapCodec httpMapCodec;
    private String headerPattern;

    public ZupTracingAutoConfiguration(@Value("${zup.tracing.header.name:x-circle-id}") String headerPattern) {
        this.headerPattern = headerPattern;
        this.httpMapCodec = TextMapCodec.builder()
                .withBaggagePrefix(this.headerPattern)
                .withUrlEncoding(false)
                .build();
    }

    @Bean
    public ServletFilterSpanDecorator createDecorator() {
        return new ZupJaegerSpanDecorator(this.headerPattern);
    }

    @Bean
    public ServletFilterSpanDecorator createDefault() {
        return ServletFilterSpanDecorator.STANDARD_TAGS;
    }

    @Bean
    public TracerBuilderCustomizer zupTracerCustomizer() {
        return builder -> builder
                .registerInjector(Format.Builtin.HTTP_HEADERS, httpMapCodec)
                .registerExtractor(Format.Builtin.HTTP_HEADERS, httpMapCodec);
    }

}
