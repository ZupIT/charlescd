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

package io.charlescd.circlematcher.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.charlescd.circlematcher.infrastructure.OpUtils;
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
