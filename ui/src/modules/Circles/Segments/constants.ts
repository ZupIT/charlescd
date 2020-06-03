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

export const CLAUSE = {
  type: 'CLAUSE',
  logicalOperator: 'OR',
  clauses: [{}]
};

export const RULE = {
  type: 'RULE',
  content: {
    key: '',
    value: [''],
    condition: ''
  }
};

export const ONE = 1;
export const RADIX = 10;
export const RULE_SIZE = 62;
export const BUTTON_RULE_SIZE = 30;
export const BUTTON_RULE_MARGIN = 20;
export const BUTTON_RULE = BUTTON_RULE_SIZE + BUTTON_RULE_MARGIN;
export const RULE_OPERATOR = 24;
