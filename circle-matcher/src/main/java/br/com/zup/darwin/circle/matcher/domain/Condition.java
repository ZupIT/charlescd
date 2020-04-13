/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.circle.matcher.domain;

import br.com.zup.darwin.circle.matcher.infrastructure.OpUtils;

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
