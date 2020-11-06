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
import io.charlescd.circlematcher.infrastructure.Constants;
import java.util.List;
import NodeType.CLAUSE;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Node {

    private NodeType type;
    private LogicalOperatorType logicalOperator;
    private List<Node> clauses;
    private Content content;

    public Node() {}

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
        var stringBuilder = new StringBuilder();
        stringBuilder.append(Constants.START_EXPRESSION);
        if (type.isA(CLAUSE)) {
            for (var clause : clauses) {
                stringBuilder.append(clause.expression())
                        .append(logicalOperator.expression());
            }
            if (hasOnlyOneClause()) {
                stringBuilder.append(logicalOperator.valueForValidSingleExpression());
            } else {
                removeLastLogicalOperator(stringBuilder);
            }
        } else {
            stringBuilder.append(content.expression());
        }
        return stringBuilder.append(Constants.END_EXPRESSION).toString();
    }

    private boolean hasOnlyOneClause() {
        return clauses.size() == 1;
    }

    private void removeLastLogicalOperator(StringBuilder stringBuilder) {
        stringBuilder.setLength(stringBuilder.length() - logicalOperator.length());
    }

}
