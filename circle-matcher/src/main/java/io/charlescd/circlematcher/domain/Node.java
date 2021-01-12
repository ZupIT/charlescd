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

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import io.charlescd.circlematcher.infrastructure.Constants;
import java.util.List;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Node {

    @NotNull
    private NodeType type;
    private LogicalOperatorType logicalOperator;
    @Valid
    private List<Node> clauses;
    @Valid
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
            return Constants.START_EXPRESSION
                    + this.content.expression()
                    + Constants.END_EXPRESSION;
        }
    }

    @JsonIgnore
    public boolean isValidRuleType() {
        return this.getType() == NodeType.RULE
                && this.getContent() != null
                && (this.getClauses() == null || this.getClauses().isEmpty());
    }

    @JsonIgnore
    public boolean isValidClauseType() {
        return this.getType() == NodeType.CLAUSE
                && this.getContent() == null
                && this.getLogicalOperator() != null
                && this.getClauses() != null
                && this.getClauses().size() > 0;
    }

    @JsonIgnore
    public boolean isDecomposable() {
        return NodeType.CLAUSE == type
                && LogicalOperatorType.OR == logicalOperator;
    }

    @JsonIgnore
    public boolean isConvertibleToKv() {
        return isValidRuleType()
                && Condition.EQUAL.name().equals(content.getCondition());
    }
}
