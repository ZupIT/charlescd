/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.circle.matcher.domain;

import br.com.zup.darwin.circle.matcher.infrastructure.OpUtils;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Content {

    private String key;
    private String condition;
    private List<String> value;

    public Content() {
    }

    public Content(String key, String condition, List<String> value) {
        this.key = key;
        this.condition = condition;
        this.value = value;
    }

    public String getKey() {
        return key;
    }

    public String getCondition() {
        return condition;
    }

    public List<String> getValue() {
        return value;
    }

    public String expression() {
        return Condition.from(condition).expression(OpUtils.inputValue(key), OpUtils.removeNullElements(value));
    }

}
