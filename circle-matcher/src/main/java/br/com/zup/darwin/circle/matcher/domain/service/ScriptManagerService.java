/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.circle.matcher.domain.service;

import br.com.zup.darwin.circle.matcher.domain.Node;

import javax.script.ScriptContext;
import javax.script.ScriptException;
import java.util.Map;

public interface ScriptManagerService {

    ScriptContext scriptContext();

    boolean isMatch(Node node, Map<String, Object> data);

    Object evalJsWithResult(ScriptContext scriptContext, String script, Object input) throws ScriptException;

    Object evalJs(ScriptContext context, String script) throws ScriptException;

    <T> T getResultVar(ScriptContext context);

    <T> T getVar(ScriptContext context, String key);
}
