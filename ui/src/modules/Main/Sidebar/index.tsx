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
import includes from 'lodash/includes';
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
import { useWorkspaces } from 'modules/Settings/hooks';
import ReactTooltip from 'react-tooltip';
import { goTo } from 'core/utils/routes';
import { isMicrofrontend } from 'App';

interface Props {
  isExpanded: boolean;
  onClickExpand: (state: ExpandClick) => void;
  selectedWorkspace?: string;
}

const Sidebar = ({ isExpanded, onClickExpand, selectedWorkspace }: Props) => {
  const [workspace, setWorkspace] = useState<Workspace>();
  const [, loadWorkspaces, loadWorkspacesResponse] = useWorkspaces();
  const [workspaces, setWorkspaces] = useState<Workspace[]>();
  const navigate = useHistory();
  const pathname = navigate.location.pathname;
  const isRootMenu =
    includes(pathname, routes.workspaces) ||
    includes(pathname, routes.users) ||
    includes(pathname, routes.account) ||
    includes(pathname, routes.groups);

  useEffect(() => {
    isRoot() && loadWorkspaces();
  }, [loadWorkspaces]);

  useEffect(() => {
    isRoot()
      ? setWorkspaces(loadWorkspacesResponse?.content)
      : setWorkspaces(getProfileByKey('workspaces'));
  }, [loadWorkspacesResponse]);

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

  const renderDropdown = () =>
    !isRootMenu && (
      <Styled.Dropdown icon="workspace">
        {map(workspaces, workspace => (
          <Styled.DropdownItem
            key={`${workspace.id}-${workspace.name}`}
            name={workspace.name}
            icon={getIcon(workspace.id)}
            onSelect={onSelect}
          />
        ))}
      </Styled.Dropdown>
    );

  const redirectToDocumentation = () => {
    goTo('https://docs.charlescd.io');
  };

  return (
    <Styled.Nav data-testid="sidebar">
      <Styled.Logo name="charles" size="37px" onClick={() => handleClick()} />

      <MenuItems
        isExpanded={isExpanded}
        expandMenu={(state: ExpandClick) => onClickExpand(state)}
      />

      <Styled.Bottom>
        <Styled.Item>
          {!isEmpty(workspaces) && renderDropdown()}
          {isExpanded && (
            <Text.h5 color="light">
              {!isRootMenu && (workspace?.name || selectedWorkspace)}
            </Text.h5>
          )}
        </Styled.Item>
        <Styled.Item>
          <Icon
            name="help"
            color="dark"
            size="15px"
            onClick={redirectToDocumentation}
            data-tip
            data-for="docTooltip"
          />
          <ReactTooltip id="docTooltip">Documentation</ReactTooltip>
        </Styled.Item>
        {!isMicrofrontend() && (
          <Styled.Item>
            <Icon name="logout" color="dark" size="15px" onClick={logout} />
          </Styled.Item>
        )}
      </Styled.Bottom>
    </Styled.Nav>
  );
};

export default Sidebar;
