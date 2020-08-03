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
import isEmpty from 'lodash/isEmpty';
import { useFieldArray, useForm, FormContext } from 'react-hook-form';
import Icon from 'core/components/Icon';
import { Rule as IRule } from './interfaces/Rule';
import { getGroupVerticalLine, changeOperatorValue } from './helpers';
import { ONE, CLAUSE, RULE } from './constants';
import { useSegment } from './hooks';
import Clause from './Clause';
import Rule from './Rule';
import Styled from './styled';

export type Rules = {
  type: string;
  clauses: (
    | {
        type: string;
        clauses: IRule[];
        logicalOperator: string;
      }
    | IRule
  )[];
  logicalOperator: string;
};

export interface Props {
  viewMode?: boolean;
  rules?: Rules;
  onSubmit?: (data: Rules) => void;
  isSaving?: boolean;
}

const Segments = ({ rules, viewMode = true, onSubmit, isSaving }: Props) => {
  const defaultValues =
    viewMode || !isEmpty(rules) ? rules : { ...CLAUSE, clauses: [RULE] };
  const form = useForm<Rules>({ defaultValues });
  const { register } = form;
  const fieldArray = useFieldArray({
    control: form.control,
    name: 'clauses'
  });
  const { addGroup, addRule, removeRule } = useSegment(fieldArray, form);
  const fields = fieldArray.fields;
  const group = getGroupVerticalLine(fields);
  const hasGroup = fields.length > ONE;

  return (
    <FormContext {...form}>
      <Styled.Form onSubmit={form.handleSubmit(onSubmit)}>
        <Styled.Group
          className="GROUP"
          top={group.top}
          verticalLine={group.height}
          hasGroup={hasGroup}
        >
          <Styled.Operator top={group.operator} hasGroup={hasGroup}>
            <Styled.InputOperator
              readOnly
              type="text"
              ref={register}
              name="logicalOperator"
              onClick={() => changeOperatorValue('logicalOperator', form)}
              defaultValue={rules?.logicalOperator}
            />
          </Styled.Operator>
          <Styled.Input type="hidden" ref={form.register} name="type" />
          {fieldArray.fields?.map((group, index) => (
            <Styled.Group key={group.id}>
              {group.type === 'CLAUSE' ? (
                <Clause
                  clauses={group}
                  viewMode={viewMode}
                  hasGroup={hasGroup}
                  prefixName={`clauses[${index}]`}
                  onRemoveRule={(clauseIndex: number) =>
                    removeRule(group, index, clauseIndex)
                  }
                />
              ) : (
                <Rule
                  isGroup
                  rule={group}
                  viewMode={viewMode}
                  prefixName={`clauses[${index}]`}
                  onRemoveRule={() => removeRule(group, index)}
                  hasGroup={hasGroup}
                />
              )}
              {!viewMode && (
                <Styled.Button.Clause
                  size="EXTRA_SMALL"
                  onClick={() => addRule(index, group)}
                >
                  <Icon name="add" size="16px" color="light" /> Rule
                </Styled.Button.Clause>
              )}
            </Styled.Group>
          ))}
        </Styled.Group>
        {!viewMode && (
          <>
            <Styled.Button.Clause size="EXTRA_SMALL" onClick={addGroup}>
              <Icon name="add" size="16px" color="light" /> Group
            </Styled.Button.Clause>
            <Styled.Button.Submit
              id="save"
              type="submit"
              isLoading={isSaving}
              isDisabled={isSaving}
            >
              Save
            </Styled.Button.Submit>
          </>
        )}
      </Styled.Form>
    </FormContext>
  );
};

export default Segments;
