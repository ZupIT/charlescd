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
import { useHistory } from 'react-router-dom';
import split from 'lodash/split';
import TabPanel from 'core/components/TabPanel';
import Dropdown from 'core/components/Dropdown';
import {
  useFindUserGroupByID,
  useListUser,
  useManagerMemberInUserGroup,
  useUpdateUserGroup,
  useDeleteUserGroup,
  useFindAllUserGroup
} from '../hooks';
import { delParamUserGroup } from '../helpers';
import Styled from './styled';
import Modal from './Modal';
import Form from './Form';
import { diffCheckedUsers } from './helpers';

interface Props {
  param: string;
}

const Tab = ({ param }: Props) => {
  const history = useHistory();
  const [search, setSearch] = useState('');
  const [isOpenModal, toggleModal] = useState(false);
  const [getUserGroup, userGroup] = useFindUserGroupByID();
  const [getAllUserGroups] = useFindAllUserGroup();
  const [editUserGroup, , editStatus] = useUpdateUserGroup();
  const [deleteUserGroup, , isDeleted] = useDeleteUserGroup();
  const [managerMemberUserGroup, memberStatus] = useManagerMemberInUserGroup();
  const [getUserList, userList] = useListUser();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [id] = split(param, '~');

  useEffect(() => {
    getUserGroup(id);
  }, [getUserGroup, id]);

  useEffect(() => {
    if (isDeleted) {
      delParamUserGroup(history, param);
    }
  }, [isDeleted, history, param]);

  useEffect(() => {
    if (memberStatus === 'resolved' || editStatus === 'resolved') {
      getUserGroup(id);
      getAllUserGroups();
    }
  }, [getUserGroup, getAllUserGroups, id, memberStatus, editStatus]);

  useEffect(() => {
    getUserList(search);
  }, [search, getUserList]);

  useEffect(() => {
    setFilteredUsers(
      diffCheckedUsers(search, userGroup?.users, userList?.content)
    );
  }, [userList, userGroup, search, setFilteredUsers]);

  const handleModalUserSelect = (memberId: string, checked: boolean) =>
    managerMemberUserGroup(checked, id, memberId);

  const renderActions = () => (
    <Styled.Actions>
      <Dropdown>
        <Dropdown.Item
          icon="delete"
          name="Delete"
          onClick={() => deleteUserGroup(userGroup?.id)}
        />
      </Dropdown>
    </Styled.Actions>
  );

  return (
    <Styled.Tab>
      <TabPanel
        name="shield"
        title={userGroup?.name}
        onClose={() => delParamUserGroup(history, param)}
        actions={renderActions()}
      >
        <Styled.Tab>
          <Form
            userGroup={userGroup}
            onAddUser={() => toggleModal(true)}
            onEdit={name => editUserGroup(id, name)}
          />
        </Styled.Tab>
      </TabPanel>
      <Modal
        users={filteredUsers}
        isOpen={isOpenModal}
        onClose={() => toggleModal(false)}
        onSearch={name => setSearch(name)}
        onSelected={handleModalUserSelect}
      />
    </Styled.Tab>
  );
};

export default Tab;
