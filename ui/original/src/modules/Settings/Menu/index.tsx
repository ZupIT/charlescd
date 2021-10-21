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
import isEmpty from 'lodash/isEmpty';
import MenuItem, { Props as MenuItemProps } from './MenuItem';
import Styled from './styled';
import Loader from './Loaders';

interface Props {
  items: MenuItemProps[];
}

const SettingsMenu = ({ items }: Props) => {
  const renderWorkspaces = () =>
    map(items, (item: MenuItemProps) => <MenuItem key={item.icon} {...item} />);

  return (
    <>
      <Styled.Content>
        <Styled.List>
          {isEmpty(items) ? <Loader.List /> : renderWorkspaces()}
        </Styled.List>
      </Styled.Content>
    </>
  );
};

export default SettingsMenu;
