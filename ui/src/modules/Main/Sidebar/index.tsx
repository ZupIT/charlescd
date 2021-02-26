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
import { useHistory } from 'react-router-dom';
import { logout } from 'core/utils/auth';
import routes from 'core/constants/routes';
import Icon from 'core/components/Icon';
import Text from 'core/components/Text';
import {
  clearWorkspace
} from 'core/utils/workspace';
import { ExpandClick } from './Types';
import MenuItems from './MenuItems';
import Styled from './styled';
import ReactTooltip from 'react-tooltip';
import { goTo } from 'core/utils/routes';
import { isMicrofrontend } from 'App';

interface Props {
  isExpanded: boolean;
  onClickExpand: (state: ExpandClick) => void;
}

const Sidebar = ({ isExpanded, onClickExpand }: Props) => {
  const navigate = useHistory();

  const handleClick = () => {
    clearWorkspace();
    navigate.push(routes.main);
  };

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
          <Styled.LinkIcon name="workspace" size="15px" isActive={false} />
          {
            isExpanded && (
              <Text.h5 color="light">Workspace</Text.h5>
            )
          }
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
