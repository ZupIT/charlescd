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
import LabeledIcon from 'core/components/LabeledIcon';
import Button from 'core/components/Button';
import Text from 'core/components/Text';
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
import ModalUsers from './Modal';
import Form from './Form';
import { diffCheckedUsers } from './helpers';

interface Props {
  param: string;
}

const Tab = ({ param }: Props) => {
  const history = useHistory();
  const [search, setSearch] = useState('');
  const [isOpenModalUsers, toggleModalUsers] = useState(false);
  const [isOpenModalPassword, toggleModalPassword] = useState(false);
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
      <LabeledIcon
        icon="shield"
        marginContent="5px"
        onClick={() => toggleModalPassword(true)}
      >
        <Text.h5 color="dark">Change password</Text.h5>
      </LabeledIcon>
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
            onAddUser={() => toggleModalUsers(true)}
            onEdit={name => editUserGroup(id, name)}
          />
        </Styled.Tab>
      </TabPanel>
      {isOpenModalPassword && (
        <Styled.ModalPassword onClose={() => toggleModalPassword(false)}>
          <Text.h2 weight="bold" color="light">
            Reset password
          </Text.h2>
          <Text.h4 color="dark">
            Are you sure you want to reset (email)s password?
          </Text.h4>
          <Button.Default size="EXTRA_SMALL" isLoading={false}>
            Yes, reset password
          </Button.Default>
        </Styled.ModalPassword>
      )}
      <ModalUsers
        users={filteredUsers}
        isOpen={isOpenModalUsers}
        onClose={() => toggleModalUsers(false)}
        onSearch={name => setSearch(name)}
        onSelected={handleModalUserSelect}
      />
    </Styled.Tab>
  );
};

export default Tab;
