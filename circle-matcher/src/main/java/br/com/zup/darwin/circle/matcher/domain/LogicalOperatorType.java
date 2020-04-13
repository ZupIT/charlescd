/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.circle.matcher.domain;

import br.com.zup.darwin.circle.matcher.infrastructure.Constants;

public enum LogicalOperatorType {
    AND {
        public String expression() {
            return Constants.AND;
        }

        public String valueForValidSingleExpression() {
            return Constants.TRUE;
        }
    },
    OR {
        public String expression() {
            return Constants.OR;
        }

        public String valueForValidSingleExpression() {
            return Constants.FALSE;
        }
    };

    public abstract String expression();

    public abstract String valueForValidSingleExpression();
}
