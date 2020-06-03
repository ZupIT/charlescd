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
import debounce from 'lodash/debounce';
import Icon from 'core/components/Icon';
import { User } from 'modules/Users/interfaces/User';
import { UserChecked } from '../../interfaces/UserChecked';
import Styled from './styled';

interface UserItemProps extends User {
  checked: boolean;
  onSelected: (id: string, checked: boolean) => void;
}

interface UserCheckedProps {
  checked: boolean;
  onSelected: (id: string, checked: boolean) => void;
}

interface Props {
  users: UserChecked[];
  isOpen: boolean;
  onClose: () => void;
  onSearch: (name: string) => void;
  onSelected: (id: string, checked: boolean) => void;
}

const MemberChecked = ({ checked }: UserCheckedProps) => (
  <Styled.Item.Checked>
    {checked ? (
      <Icon name="checkmark-circle" color="success" size="24px" />
    ) : (
      <Icon name="plus-circle" color="medium" size="24px" />
    )}
  </Styled.Item.Checked>
);

const UserItem = ({
  id,
  name,
  email,
  photoUrl,
  checked,
  onSelected
}: UserItemProps) => (
  <Styled.Item.Wrapper onClick={() => onSelected(id, checked)}>
    <Styled.Item.Profile>
      <Styled.Item.Photo src={photoUrl} name={name} />
      <div>
        <Styled.Item.Name>{name}</Styled.Item.Name>
        <Styled.Item.Email>{email}</Styled.Item.Email>
      </div>
    </Styled.Item.Profile>
    <MemberChecked checked={checked} onSelected={onSelected} />
  </Styled.Item.Wrapper>
);

const AddUserModal = ({
  users,
  isOpen,
  onClose,
  onSearch,
  onSelected
}: Props) => {
  const handleChange = debounce(onSearch, 500);

  return (
    <Styled.Wrapper isOpen={isOpen} onClose={onClose}>
      <Styled.Header>
        Add or remove people in this user group
        <Styled.Label>Add a user:</Styled.Label>
        <Styled.Search
          label="Enter the user's email"
          onChange={e => handleChange(e.currentTarget.value)}
        />
      </Styled.Header>
      <Styled.Content>
        {map(users, user => (
          <UserItem key={user.id} {...user} onSelected={onSelected} />
        ))}
      </Styled.Content>
    </Styled.Wrapper>
  );
};

export default AddUserModal;
