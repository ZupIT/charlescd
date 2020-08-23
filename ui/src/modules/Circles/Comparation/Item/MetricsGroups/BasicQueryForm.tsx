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
import Styled from './styled';
import { useFormContext } from 'react-hook-form';
import StyledRule from 'modules/Circles/Segments/styled';
import { operatorsOptions } from './constants';
import Icon from 'core/components/Icon';
import { getOperator } from './helpers';
import { MetricFilter } from './types';

type Props = {
  filters: MetricFilter[];
  onAddFilter: () => void;
  onRemoveFilter: (index: string) => void;
};

const BasicQueryForm = ({ filters, onAddFilter, onRemoveFilter }: Props) => {
  const { register, control } = useFormContext();

  return (
    <>
      {filters.map((item, index) => (
        <Styled.RuleWrapper key={item.id}>
          <StyledRule.Rule data-testid="segments-rules">
            <StyledRule.RuleTrash>
              <StyledRule.Button.Icon
                name="trash"
                size="15px"
                color="light"
                onClick={() => onRemoveFilter(item.id)}
              />
            </StyledRule.RuleTrash>
            <StyledRule.Input
              label="Filter"
              ref={register({ required: true })}
              name={`filters.${index}.field`}
              defaultValue={item.field}
            />
            <StyledRule.Select
              options={operatorsOptions}
              control={control}
              rules={{ required: true }}
              label="Conditional"
              name={`filters.${index}.operator`}
              defaultValue={getOperator(item.operator)}
            />
            <StyledRule.Input
              label="Value"
              ref={register}
              name={`filters.${index}.value`}
              defaultValue={item.value}
            />
          </StyledRule.Rule>
        </Styled.RuleWrapper>
      ))}
      <StyledRule.Button.Clause
        id="add-clause"
        size="EXTRA_SMALL"
        onClick={onAddFilter}
      >
        <Icon name="add" size="16px" color="light" /> Rule
      </StyledRule.Button.Clause>
    </>
  );
};

export default BasicQueryForm;
