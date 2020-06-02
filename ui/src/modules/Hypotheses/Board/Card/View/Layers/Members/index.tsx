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

import React, { useEffect, useState } from 'react';
import map from 'lodash/map';
import ContentIcon from 'core/components/ContentIcon';
import Layer from 'core/components/Layer';
import Text from 'core/components/Text';
import Modal from './Modal';
import { User } from 'modules/Users/interfaces/User';
import { useUsers } from './hooks';
import Styled from './styled';

interface Props {
  cardId: string;
  members: User[];
  onFinish: Function;
}

const Members = ({ cardId, members, onFinish }: Props) => {
  const [isOpen, openModal] = useState(false);
  const { getAllUsers, loadingUsers, users } = useUsers();

  useEffect(() => {
    if (users) openModal(true);
  }, [users]);

  const handleClose = () => {
    openModal(false);
    if (onFinish) onFinish();
  };

  const renderAvatars = () =>
    map(members, member => (
      <Styled.Avatar
        key={member.name}
        src={member.photoUrl}
        name={member.name}
      />
    ));

  return (
    <Layer>
      <ContentIcon icon="users">
        <Text.h2 color="light">Members</Text.h2>
        <Styled.ButtonAdd
          name="plus-circle"
          color="dark"
          isLoading={loadingUsers}
          onClick={() => getAllUsers()}
        >
          Add / Remove user
        </Styled.ButtonAdd>
        <Styled.UserList>{renderAvatars()}</Styled.UserList>
      </ContentIcon>
      {isOpen && (
        <Modal
          cardId={cardId}
          users={users}
          members={members}
          onClose={() => handleClose()}
        />
      )}
    </Layer>
  );
};

export default Members;
