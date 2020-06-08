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
import find from 'lodash/find';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import { logout, isRoot } from 'core/utils/auth';
import routes from 'core/constants/routes';
import Icon from 'core/components/Icon';
import Text from 'core/components/Text';
import { getProfileByKey } from 'core/utils/profile';
import { setUserAbilities } from 'core/utils/abilities';
import {
  saveWorkspace,
  getWorkspaceId,
  clearWorkspace
} from 'core/utils/workspace';
import { Workspace } from 'modules/Users/interfaces/User';
import { ExpandClick } from './Types';
import MenuItems from './MenuItems';
import Styled from './styled';

interface Props {
  isExpanded: boolean;
  onClickExpand: (state: ExpandClick) => void;
  isNotAllowed: boolean
}

const Sidebar = ({ isExpanded, onClickExpand, isNotAllowed }: Props) => {
  const [workspace, setWorkspace] = useState<Workspace>();
  const [workspaces, setWorkspaces] = useState<Workspace[]>();
  const navigate = useHistory();

  useEffect(() => {
    setWorkspaces(getProfileByKey('workspaces'));
  }, []);

  useEffect(() => {
    setWorkspace(find(workspaces, ['id', getWorkspaceId()]));
  }, [workspaces]);

  const handleClick = () => {
    clearWorkspace();
    setWorkspace(null);
    navigate.push(routes.main);
  };

  const onSelect = (name: string) => {
    saveWorkspace(find(workspaces, ['name', name]));
    setUserAbilities();
    navigate.push({
      pathname: isRoot() ? routes.credentials : routes.circles
    });
    window.location.reload(false);
  };

  const getIcon = (workspaceId: string) =>
    getWorkspaceId() === workspaceId && 'checkmark';

  const renderDropdown = () => (
    <Styled.Dropdown icon="workspace">
      {map(workspaces, workspace => (
        <Styled.DropdownItem
          key={workspace.name}
          name={workspace.name}
          icon={getIcon(workspace.id)}
          onSelect={onSelect}
        />
      ))}
    </Styled.Dropdown>
  );

  return (
    <Styled.Nav data-testid="sidebar">
      <Styled.Logo name="charles" size="37px" onClick={() => handleClick()} />

      <MenuItems
        isNotAllowed={isNotAllowed}
        isExpanded={isExpanded}
        expandMenu={(state: ExpandClick) => onClickExpand(state)}
      />

      <Styled.Bottom>
        <Styled.Item>
          {!isEmpty(workspaces) && renderDropdown()}
          {isExpanded && <Text.h5 color="light">{workspace?.name}</Text.h5>}
        </Styled.Item>
        <Styled.Item>
          <Icon name="logout" color="dark" size="15px" onClick={logout} />
        </Styled.Item>
      </Styled.Bottom>
    </Styled.Nav>
  );
};

export default Sidebar;
