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

import map from 'lodash/map';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import lodashReduce from 'lodash/reduce';
import { UserGroup } from './interfaces';

export const reduce = (groups: UserGroup[]) =>
  map(groups, item => ({
    label: item.name,
    value: item.id,
    icon: 'users'
  }));

export const hasUserDuplication = (userGroups: any, email: string) => {
  const emails = lodashReduce(userGroups, (result, userGroup) => {
    const user = find(userGroup.users, (user) => user.email === email);

    return isEmpty(user) ? [...result] : [...result, user.email];
  }, []);

  return emails.length > 1;
};