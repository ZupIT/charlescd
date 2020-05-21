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

import io.charlescd.circlematcher.infrastructure.OpUtils;

import java.util.List;

public enum Condition {

    EQUAL("toStr(%s) == toStr(%s)") {
        public String expression(String key, List<String> values) {
            if (OpUtils.isSingleVal(values)) {
                return defaultExpression(key, values);
            } else {
                return OpUtils.containsExpression(key, values);
            }
        }
    },

    NOT_EQUAL("toStr(%s) != toStr(%s)") {
        public String expression(String key, List<String> values) {
            if (OpUtils.isSingleVal(values)) {
                return defaultExpression(key, values);
            } else {
                return OpUtils.notContainsExpression(key, values);
            }
        }
    },

    STARTS_WITH("toStr(%s).startsWith(toStr(%s))") {
        public String expression(String key, List<String> values) {
            return defaultExpression(key, values);
        }
    },

    LESS_THAN("toNumber(%s) < toNumber(%s)") {
        public String expression(String key, List<String> values) {
            return defaultExpression(key, values);
        }
    },

    LESS_THAN_OR_EQUAL("toNumber(%s) <= toNumber(%s)") {
        public String expression(String key, List<String> values) {
            return defaultExpression(key, values);
        }
    },

    GREATER_THAN("toNumber(%s) > toNumber(%s)") {
        public String expression(String key, List<String> values) {
            return defaultExpression(key, values);
        }
    },

    GREATER_THAN_OR_EQUAL("toNumber(%s) >= toNumber(%s)") {
        public String expression(String key, List<String> values) {
            return defaultExpression(key, values);
        }
    },

    CONTAINS("(%s.indexOf(toStr(%s)) >= 0)") {
        public String expression(String key, List<String> values) {
            return String.format(this.jsExpression,
                    OpUtils.arrVal(values),
                    key);
        }
    },

    NOT_CONTAINS("(%s.indexOf(toStr(%s)) < 0)") {
        public String expression(String key, List<String> values) {
            return String.format(this.jsExpression,
                    OpUtils.arrVal(values),
                    key);
        }
    },

    BETWEEN("((%s >= parseFloat(%s)) && (%s <= parseFloat(%s)))") {
        public String expression(String key, List<String> values) {
            if (values.size() != 2) {
                throw new IllegalArgumentException("Invalid between expression");
            }
            return String.format(this.jsExpression,
                    key,
                    values.get(0),
                    key,
                    values.get(1));
        }
    },

    NOT_FOUND(null) {
        public String expression(String key, List<String> values) {
            throw new IllegalArgumentException("Invalid null expression");
        }
    };

    String jsExpression;

    Condition(String jsExpression) {
        this.jsExpression = jsExpression;
    }

    public String defaultExpression(String key, List<String> values) {
        return String.format(this.jsExpression,
                key,
                OpUtils.bestVal(
                        OpUtils.singleVal(values).orElseThrow()
                ));
    }

    static Condition from(String condition) {
        for (var value : values()) {
            if (value.name().equals(condition)) {
                return value;
            }
        }
        return NOT_FOUND;
    }

    abstract String expression(String key, List<String> values);

}
