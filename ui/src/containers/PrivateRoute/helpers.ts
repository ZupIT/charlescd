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

import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import { ability, Actions, Subjects } from 'core/utils/abilities';

export const isAllowed = (allowedRoles: string[]) => {
  const rule = find(allowedRoles, (role: string) => {
    const [subject, action] = role.split('_') || ['', ''];
    return ability.relevantRuleFor(action as Actions, subject as Subjects);
    
  });

  console.log('======= start ======');
  console.log('isAllowed: rule: ', rule);
  console.log('isAllowed: ability: ', ability.rules);
  console.log('isAllowed: RETURN (!isEmpty(rule)): ', !isEmpty(rule));

  return !isEmpty(rule);
};