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

import java.sql.SQLOutput;
import java.util.Map;
import javax.script.ScriptContext;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import javax.script.SimpleScriptContext;

import org.graalvm.polyglot.Context;
import org.graalvm.polyglot.Value;
import org.graalvm.polyglot.proxy.ProxyObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class ScriptManagerServiceImpl implements ScriptManagerService {

    private Logger logger = LoggerFactory.getLogger(ScriptManagerServiceImpl.class);
    private Context context;
    public ScriptManagerServiceImpl() {

    }

    public void scriptContext() {

        try{
            var toStrScript = ResourceUtils.getResourceAsString("js/toStr.js");
            var toNumberScript = ResourceUtils.getResourceAsString("js/toNumber.js");
            var getPathScript = ResourceUtils.getResourceAsString("js/getPath.js");
            this.context = Context.newBuilder("js").allowExperimentalOptions(true).option("js.nashorn-compat", "true").build();
            context.eval("js", getPathScript);
            context.eval("js", toNumberScript);
            context.eval("js", toStrScript);
        } catch (Exception ex) {
            this.logger.error("Could not evaluate expression", ex);
        }
    }

    public boolean isMatch(Node node, Map<String, Object> data) {
        try {
            scriptContext();
            var exp = node.expression();
            var result = evalJsWithResult(exp, data);
            return result.asBoolean();
        } catch (Exception ex) {
            System.out.println(ex);
            return false;
        }
    }

    public Value evalJsWithResult(String script, Map<String,Object> input) {
        try{
            putVar(Constants.INPUT_VARIABLE, ProxyObject.fromMap(input));
            this.context.eval("js", OpUtils.evalExpression(script));
            return this.getVar(Constants.RESULT_VARIABLE);
        }catch (Exception exception){
            return null;
        }

    }

    public Object evalJs(String script) throws ScriptException {

        return this.context.eval("js", script);
    }

    public <T> T getResultVar() {
        return (T) this.context.getBindings("js").getMember(Constants.RESULT_VARIABLE);
    }

    public <T> T getVar(String key) {
        System.out.println(context.getBindings("js").getMember(key));
        return (T) context.getBindings("js").getMember(key);
    }

    private void putVar(String key, Object value) {
        context.getBindings("js").putMember(key, value);

    }
}
