/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.circle.matcher.domain.service.impl;

import br.com.zup.darwin.circle.matcher.domain.Node;
import br.com.zup.darwin.circle.matcher.domain.service.ScriptManagerService;
import br.com.zup.darwin.circle.matcher.infrastructure.Constants;
import br.com.zup.darwin.circle.matcher.infrastructure.OpUtils;
import br.com.zup.darwin.circle.matcher.infrastructure.ResourceUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.script.*;
import java.util.Map;

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