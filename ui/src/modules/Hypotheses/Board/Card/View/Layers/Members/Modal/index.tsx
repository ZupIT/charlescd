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

import React, { useState, useEffect } from 'react';
import map from 'lodash/map';
import filter from 'lodash/filter';
import xor from 'lodash/xor';
import isEmpty from 'lodash/isEmpty';
import lowerCase from 'lodash/lowerCase';
import includes from 'lodash/includes';
import AvatarName from 'core/components/AvatarName';
import Text from 'core/components/Text';
import { getProfileByKey } from 'core/utils/profile';
import { User } from 'modules/Users/interfaces/User';
import { useAddMember } from 'modules/Hypotheses/Board/hooks';
import Checked from './Checked';
import Styled from './styled';

interface Props {
  cardId: string;
  onClose: Function;
  users: User[];
  members: User[];
}

const Modal = ({ cardId, users, members, onClose }: Props) => {
  const { addMembers, loading } = useAddMember();
  const [membersFiltered, filterMembers] = useState<User[]>(users);
  const [memberIds, setMemberIds] = useState<string[]>();
  const handleClose = () => onClose();

  useEffect(() => {
    if (members) {
      setMemberIds(map(members, 'id'));
    }
  }, [members]);

  useEffect(() => {
    if (memberIds) {
      addMembers(cardId, getProfileByKey('id'), memberIds);
    }
  }, [memberIds, addMembers, cardId]);

  const handleChange = (value: string) => {
    filterMembers(
      filter(
        users,
        user =>
          includes(lowerCase(user.name), lowerCase(value)) ||
          includes(lowerCase(user.email), lowerCase(value))
      )
    );
  };

  const toggleMember = (id: string) => {
    setMemberIds(xor(memberIds, [id]));
  };

  const renderUser = (user: User) => (
    <Styled.User key={user.email}>
      <AvatarName name={user.name} src={user.photoUrl} />
      <Styled.Description>
        <Text.h4 color="light">{user.name}</Text.h4>
        <Text.h5 color="dark">{user.email}</Text.h5>
      </Styled.Description>
      <Checked
        checked={includes(memberIds, user.id)}
        id={user.id}
        isLoading={loading}
        onChange={(id: string) => toggleMember(id)}
      />
    </Styled.User>
  );

  const renderMembers = () =>
    isEmpty(membersFiltered) ? (
      <Text.h6 color="dark">{`Where's everybody?`}</Text.h6>
    ) : (
      <Styled.Panel size="400px">
        {map(membersFiltered, user => renderUser(user))}
      </Styled.Panel>
    );

  return (
    <Styled.Modal onClose={handleClose}>
      <Styled.Header>
        <Text.h4 color="light">Add or remove people</Text.h4>
        <Styled.Search
          label="Filter by name or email"
          onChange={e => handleChange(e.currentTarget.value)}
        />
      </Styled.Header>
      <Styled.Content>{renderMembers()}</Styled.Content>
    </Styled.Modal>
  );
};

export default Modal;
