/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.circle.matcher.domain;

import br.com.zup.darwin.circle.matcher.infrastructure.Constants;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Node {

    private NodeType type;
    private LogicalOperatorType logicalOperator;
    private List<Node> clauses;
    private Content content;

    public Node() {
    }

    public Node(NodeType type, LogicalOperatorType logicalOperator, List<Node> clauses, Content content) {
        this.type = type;
        this.logicalOperator = logicalOperator;
        this.clauses = clauses;
        this.content = content;
    }

    public NodeType getType() {
        return type;
    }

    public LogicalOperatorType getLogicalOperator() {
        return logicalOperator;
    }

    public List<Node> getClauses() {
        return clauses;
    }

    public Content getContent() {
        return content;
    }

    public String expression() {

        if (NodeType.CLAUSE == type) {
            var stringBuilder = new StringBuilder();
            stringBuilder.append(Constants.START_EXPRESSION);

            if (clauses.size() == 1) {
                return stringBuilder.append(clauses.get(0).expression())
                        .append(this.logicalOperator.expression())
                        .append(this.logicalOperator.valueForValidSingleExpression())
                        .append(Constants.END_EXPRESSION)
                        .toString();
            }

            for (var clause : clauses) {
                stringBuilder.append(clause.expression()).append(this.logicalOperator.expression());
            }

            stringBuilder.setLength(stringBuilder.length() - 2);
            return stringBuilder.append(Constants.END_EXPRESSION)
                    .toString();
        } else {
            return Constants.START_EXPRESSION +
                    this.content.expression() +
                    Constants.END_EXPRESSION;
        }
    }

}
