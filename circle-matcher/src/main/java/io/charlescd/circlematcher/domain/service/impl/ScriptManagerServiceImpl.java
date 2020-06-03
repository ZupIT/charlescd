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
import javax.script.ScriptContext;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import javax.script.SimpleScriptContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class ScriptManagerServiceImpl implements ScriptManagerService {

    private ScriptEngine scriptEngine;
    private String getPathScript;
    private String toStrScript;
    private String toNumberScript;

    private Logger logger = LoggerFactory.getLogger(ScriptManagerServiceImpl.class);

    public ScriptManagerServiceImpl() {
        this.toStrScript = ResourceUtils.getResourceAsString("js/toStr.js");
        this.toNumberScript = ResourceUtils.getResourceAsString("js/toNumber.js");
        this.getPathScript = ResourceUtils.getResourceAsString("js/getPath.js");
        this.scriptEngine = new ScriptEngineManager().getEngineByName("JavaScript");
    }

    public ScriptContext scriptContext() {
        var bindings = this.scriptEngine.createBindings();
        var context = new SimpleScriptContext();
        context.setBindings(bindings, ScriptContext.ENGINE_SCOPE);

        try {
            evalJs(context, this.getPathScript);
            evalJs(context, this.toStrScript);
            evalJs(context, this.toNumberScript);
        } catch (Exception ex) {
            this.logger.error("Could not evaluate expression", ex);
        }

        return context;
    }

    public boolean isMatch(Node node, Map<String, Object> data) {
        try {
            var context = scriptContext();
            var exp = node.expression();
            evalJsWithResult(context, exp, data);
            return getResultVar(context);
        } catch (ScriptException ex) {
            return false;
        }
    }

    public Object evalJsWithResult(ScriptContext scriptContext, String script, Object input) throws ScriptException {
        putVar(scriptContext, Constants.INPUT_VARIABLE, input);
        return this.scriptEngine.eval(OpUtils.evalExpression(script), scriptContext);
    }

    public Object evalJs(ScriptContext context, String script) throws ScriptException {
        return this.scriptEngine.eval(script, context);
    }

    public <T> T getResultVar(ScriptContext context) {
        return (T) context.getBindings(ScriptContext.ENGINE_SCOPE).get(Constants.RESULT_VARIABLE);
    }

    public <T> T getVar(ScriptContext context, String key) {
        return (T) context.getBindings(ScriptContext.ENGINE_SCOPE).get(key);
    }

    private void putVar(ScriptContext scriptContext, String key, Object value) {
        scriptContext.getBindings(ScriptContext.ENGINE_SCOPE).put(key, value);
    }
}
