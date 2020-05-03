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

package br.com.zup.tracing.zuptracing.decorator;

import io.opentracing.Span;
import io.opentracing.contrib.web.servlet.filter.ServletFilterSpanDecorator;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Collections;

public class ZupJaegerSpanDecorator implements ServletFilterSpanDecorator {

    private String headerPattern;

    public ZupJaegerSpanDecorator(String headerPattern) {
        this.headerPattern = headerPattern;
    }

    @Override
    public void onRequest(HttpServletRequest httpServletRequest, Span span) {
        Collections.list(httpServletRequest.getHeaderNames())
                .stream()
                .filter(header -> header.equals(this.headerPattern))
                .forEach(header -> this.processSpan(httpServletRequest, span, header));
    }

    private void processSpan(HttpServletRequest httpServletRequest, Span span, String header) {
        String value = httpServletRequest.getHeader(header);
        span.setBaggageItem(header, value);
    }

    @Override
    public void onResponse(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Span span) {

    }

    @Override
    public void onError(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Throwable throwable, Span span) {

    }

    @Override
    public void onTimeout(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, long l, Span span) {

    }

}
