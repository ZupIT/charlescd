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

import { User } from 'modules/Users/interfaces/User';
import map from 'lodash/map';
import filter from 'lodash/filter';
import some from 'lodash/some';
import isEmpty from 'lodash/isEmpty';
import { UserChecked } from '../interfaces/UserChecked';

const filterSelectedUsers = (selectedUsers: UserChecked[], search: string) =>
  filter(
    selectedUsers,
    ({ email }) =>
      email?.toLocaleLowerCase().indexOf(search?.toLowerCase()) !== -1
  );

const getNotIncludedUsers = (
  search: string,
  selectedUsers: UserChecked[],
  filteredUsers: UserChecked[]
) => {
  const filteredSelectedUsers = filterSelectedUsers(selectedUsers, search);

  return filter(
    filteredUsers,
    noMember =>
      !some(filteredSelectedUsers, member => noMember.name === member.name)
  );
};

export const diffCheckedUsers = (
  search: string,
  selectedUsers: User[],
  filteredUsers: User[]
) => {
  const mappedSelectedUsers = map(selectedUsers, user => ({
    ...user,
    checked: true
  }));
  const mappedFilteredUsers = map(filteredUsers, user => ({
    ...user,
    checked: false
  }));

  if (isEmpty(search)) {
    return mappedSelectedUsers;
  }

  const filteredSelectedUsers = filterSelectedUsers(
    mappedSelectedUsers,
    search
  );
  const notIncludedUsers = getNotIncludedUsers(
    search,
    filteredSelectedUsers,
    mappedFilteredUsers
  );

  return [...filteredSelectedUsers, ...notIncludedUsers];
};
