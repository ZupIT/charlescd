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
import org.graalvm.polyglot.Value;
import org.graalvm.polyglot.proxy.ProxyObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class ScriptManagerServiceImpl implements ScriptManagerService {

    private Logger logger = LoggerFactory.getLogger(ScriptManagerServiceImpl.class);
    private String toStrScript;
    private String toNumberScript;
    private String getPathScript;

    public ScriptManagerServiceImpl() {
        this.toStrScript =  ResourceUtils.getResourceAsString("js/toStr.js");
        this.toNumberScript = ResourceUtils.getResourceAsString("js/toNumber.js");
        this.getPathScript = ResourceUtils.getResourceAsString("js/getPath.js");
    }

    public Context scriptContext() {
        try {
            Context context = Context.newBuilder("js").allowExperimentalOptions(true)
                    .option("js.nashorn-compat", "true").build();
            this.evalJs(context, getPathScript);
            this.evalJs(context, toStrScript);
            this.evalJs(context, toNumberScript);
            return context;
        } catch (Exception ex) {
            this.logger.error("Could not evaluate expression", ex);
            throw ex;
        }
    }

    public boolean isMatch(Node node, Map<String, Object> data) {
        try (Context context = scriptContext()) {
            var exp = node.expression();
            var result = evalJsWithResult(context, exp, data);
            return result.asBoolean();
        } catch (Exception ex) {
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
