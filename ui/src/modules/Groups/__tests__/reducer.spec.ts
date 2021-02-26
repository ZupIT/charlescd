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

import { UserGroup } from '../interfaces/UserGroups';
import { ACTION_TYPES } from '../state/actions';
import { initialListState, userGroupReducer } from '../state/reducer';

const userGroup: UserGroup = {
  id: '123',
  name: 'group 1',
  users: [{
    id: '456',
    name: 'charles',
    email: 'darwin@charles.io'
  }]
}

const userGroupInitialState = {
  list: { ...initialListState, content: [
    userGroup
  ] },
  item: userGroup
}

test('paginate a user group', async () => {
  const userGroup2 = { ...userGroup, name: 'group 2' };
  const groupReducer = userGroupReducer(
    userGroupInitialState,
    { type: ACTION_TYPES.loadedUserGroups, payload: { ...initialListState, content: [ userGroup2 ]} });

  expect(groupReducer.list.content.length).toBe(2);
});

test('update an user group', async () => {
  const userGroup2 = { ...userGroup, name: 'group 2' };
  const groupReducer = userGroupReducer(
    userGroupInitialState,
    { type: ACTION_TYPES.updateUserGroup, payload: userGroup2 });

  expect(groupReducer.list.content[0]).toBe(userGroup2);
});

test('do not update an user group', async () => {
  const userGroup2 = { ...userGroup, id: '456', name: 'group 2' };
  const groupReducer = userGroupReducer(
    userGroupInitialState,
    { type: ACTION_TYPES.updateUserGroup, payload: userGroup2 });

  expect(groupReducer.list.content[0]).toBe(userGroup);
});