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

import React from 'react';
import map from 'lodash/map';
import size from 'lodash/size';
import { ArrayField, useFormContext } from 'react-hook-form';
import { RADIX } from './constants';
import Rule from './Rule';
import Styled from './styled';
import {
  getClauseOperatorPosition,
  getClauseVerticalLine,
  getClauseHorizontalLine,
  changeOperatorValue
} from './helpers';

interface Props {
  prefixName: string;
  viewMode: boolean;
  clauses: Partial<ArrayField<Record<string, object>, 'id'>>;
  onRemoveRule?: (clauseIndex: number) => void;
  hasGroup?: boolean;
}

const Clause = ({
  prefixName,
  clauses,
  viewMode,
  onRemoveRule,
  hasGroup
}: Props) => {
  const form = useFormContext();
  const { register } = form;
  const clauseSize = size(clauses.clauses);
  const operatorPosition = getClauseOperatorPosition(clauseSize);
  const verticalLine = getClauseVerticalLine(clauseSize);
  const horizontalLine = getClauseHorizontalLine(clauseSize);
  const logicalOperatorName = `${prefixName}.logicalOperator`;

  return (
    <Styled.Clause
      verticalLine={verticalLine}
      horizontalLine={horizontalLine}
      hasGroup={hasGroup}
      viewMode={viewMode}
    >
      {!viewMode && (
        <Styled.Operator top={operatorPosition} isClause hasGroup>
          <Styled.InputOperator
            readOnly
            type="text"
            ref={register}
            name={logicalOperatorName}
            onClick={() => changeOperatorValue(logicalOperatorName, form)}
            defaultValue={clauses?.logicalOperator.toString()}
          />
        </Styled.Operator>
      )}
      <Styled.Input
        type="hidden"
        ref={register}
        name={`${prefixName}.type`}
        defaultValue="CLAUSE"
      />
      {map(clauses?.clauses, (rule, index) => (
        <Rule
          rule={rule}
          key={index}
          viewMode={viewMode}
          onRemoveRule={() => onRemoveRule(parseInt(index, RADIX))}
          prefixName={`${prefixName}.clauses[${index}]`}
          hasGroup
        />
      ))}
    </Styled.Clause>
  );
};

export default Clause;
