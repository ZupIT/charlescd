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

import { ArrayField } from 'react-hook-form';
import size from 'lodash/size';
import options from './conditional.options';
import { RULE_SIZE, RULE_OPERATOR, BUTTON_RULE } from './constants';

const HALF = 2;
const PIXEL = 1;

export const getCondition = (condition: string) =>
  options.find(({ value }) => condition === value);

export const getClauseOperatorPosition = (size: number) =>
  (RULE_SIZE * size) / HALF + RULE_SIZE / HALF - RULE_OPERATOR / HALF;

export const getClauseVerticalLine = (size: number) =>
  RULE_SIZE * size - RULE_SIZE;

export const getClauseHorizontalLine = (size: number) =>
  (size * RULE_SIZE - RULE_SIZE) / HALF + RULE_SIZE - PIXEL;

const getGroupClauseHeight = (size: number) =>
  (size * RULE_SIZE - RULE_SIZE) / HALF;

export const hasGroupOperator = (
  fields: Partial<ArrayField<Record<string, string>, 'id'>>[]
) => {
  console.log('fields', fields);
  return true;
};

export const getGroupVerticalLine = (
  fields: Partial<ArrayField<Record<string, string>, 'id'>>[]
) => {
  let height = 0;
  let top = 0;
  let firstGroupIsRule = false;
  const first = 0;

  fields?.map((field, index) => {
    const isMiddleGroup = index > first && index < fields.length - 1;

    if (index === first) {
      top =
        field.type === 'CLAUSE'
          ? getClauseHorizontalLine(size(field.clauses))
          : RULE_SIZE;

      firstGroupIsRule = field.type === 'RULE';

      height += firstGroupIsRule
        ? 0
        : getGroupClauseHeight(size(field.clauses));
    } else if (field.type === 'RULE') {
      height += RULE_SIZE;
    } else if (field.type === 'CLAUSE' && isMiddleGroup) {
      height += size(field.clauses) * RULE_SIZE;
    } else if (field.type === 'CLAUSE') {
      height += getGroupClauseHeight(size(field.clauses)) + RULE_SIZE;
    }
  });

  const sumButtons = fields.length * BUTTON_RULE - BUTTON_RULE;
  height += sumButtons;

  const operator = height / HALF + top - RULE_OPERATOR / HALF;

  return {
    top,
    height,
    operator
  };
};

export const changeOperatorValue = (
  name: string,
  form: { getValues: Function; watch: Function; setValue: Function }
) => {
  const values = form.getValues();
  const newValue = values[name] === 'AND' ? 'OR' : 'AND';
  form.setValue(name, newValue);
};
