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

package io.charlescd.circlematcher.domain.service.impl;

import io.charlescd.circlematcher.domain.Node;
import io.charlescd.circlematcher.domain.service.ScriptManagerService;
import io.charlescd.circlematcher.infrastructure.Constants;
import io.charlescd.circlematcher.infrastructure.OpUtils;
import io.charlescd.circlematcher.infrastructure.ResourceUtils;
import java.util.Map;
import org.graalvm.polyglot.Context;
import org.graalvm.polyglot.Engine;
import org.graalvm.polyglot.PolyglotException;
import org.graalvm.polyglot.Source;
import org.graalvm.polyglot.Value;
import org.graalvm.polyglot.proxy.ProxyObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class ScriptManagerServiceImpl implements ScriptManagerService {

    private Logger logger = LoggerFactory.getLogger(ScriptManagerServiceImpl.class);
    private Source toStrScript;
    private Source toNumberScript;
    private Source getPathScript;
    private org.graalvm.polyglot.Engine engine;

    public ScriptManagerServiceImpl() {
        this.engine = Engine.create();
        this.toStrScript = Source.create("js", ResourceUtils.getResourceAsString("js/toStr.js"));
        this.toNumberScript = Source.create("js", ResourceUtils.getResourceAsString("js/toNumber.js"));
        this.getPathScript = Source.create("js", ResourceUtils.getResourceAsString("js/getPath.js"));
    }

    public Context scriptContext() {
        Context context = Context.newBuilder("js").engine(this.engine).build();
        this.evalJs(context, getPathScript);
        this.evalJs(context, toStrScript);
        this.evalJs(context, toNumberScript);
        return context;
    }

    public boolean isMatch(Node node, Map<String, Object> data) {
        try (Context context = scriptContext()) {
            var exp = node.expression();
            var result = evalJsWithResult(context, exp, data);
            return result.asBoolean();
        } catch (PolyglotException ex) {
            logger.error("Error executing script", ex);
            return false;
        }
    }

    public Value evalJsWithResult(Context context, String script, Map<String, Object> input) {
        putVar(context, Constants.INPUT_VARIABLE, ProxyObject.fromMap(input));
        this.evalJs(context, OpUtils.evalExpression(script));
        return this.getResultVar(context);
    }

    public Object evalJs(Context context, String script) {
        return context.eval("js", script);
    }

    public Object evalJs(Context context, Source source) {
        return context.eval(source);
    }

    public Value getResultVar(Context context) {
        return context.getBindings("js").getMember(Constants.RESULT_VARIABLE);
    }

    public Value getVar(Context context, String key) {
        return context.getBindings("js").getMember(key);
    }

    private void putVar(Context context, String key, Object value) {
        context.getBindings("js").putMember(key, value);
    }
}
