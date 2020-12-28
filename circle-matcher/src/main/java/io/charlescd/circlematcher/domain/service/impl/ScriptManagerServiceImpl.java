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

import org.graalvm.polyglot.Context;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class ScriptManagerServiceImpl implements ScriptManagerService {

    private Context context;
    private String getPathScript;
    private String toStrScript;
    private String toNumberScript;

    private Logger logger = LoggerFactory.getLogger(ScriptManagerServiceImpl.class);

    public ScriptManagerServiceImpl() {
        this.toStrScript = ResourceUtils.getResourceAsString("js/toStr.js");
        this.toNumberScript = ResourceUtils.getResourceAsString("js/toNumber.js");
        this.getPathScript = ResourceUtils.getResourceAsString("js/getPath.js");
        this.context = scriptContext();
    }

    public Context scriptContext() {
        Context context = Context.create("js");
        try{

            context.eval("js", this.getPathScript);
            context.eval("js", this.toNumberScript);
            context.eval("js", this.toStrScript);
        } catch (Exception ex) {
            this.logger.error("Could not evaluate expression", ex);
        }

        return context;
    }

    public boolean isMatch(Node node, Map<String, Object> data) {
        try {
            var exp = node.expression();
            evalJsWithResult(exp, data);
            return getResultVar();
        } catch (ScriptException ex) {
            return false;
        }
    }

    public Object evalJsWithResult(String script, Object input) throws ScriptException {
        putVar(Constants.INPUT_VARIABLE, input);
        return this.context.eval("js", OpUtils.evalExpression(script));
    }

    public Object evalJs(String script) throws ScriptException {

        return this.context.eval("js", script);
    }

    public <T> T getResultVar() {
        return (T) this.context.getBindings("js").getMember(Constants.RESULT_VARIABLE);
    }

    public <T> T getVar(String key) {
        return (T) context.getBindings("js").getMember(key);
    }

    private void putVar(String key, Object value) {

        context.getBindings("js").putMember(key, value);
    }
}
