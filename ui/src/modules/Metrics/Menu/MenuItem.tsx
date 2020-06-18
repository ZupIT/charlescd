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

import React, { memo } from 'react';
import {
  useHistory,
  generatePath,
  useLocation,
  matchPath
} from 'react-router-dom';
import routes from 'core/constants/routes';
import Styled from './styled';

export interface Props {
  id: string;
  name: string;
}

const MenuItem = ({ id, name }: Props) => {
  const history = useHistory();
  const location = useLocation();

  const path = matchPath<{ id: string }>(location.pathname, {
    path: routes.metricsDashboard
  });

  const handleClick = (id: string) => {
    history.push(generatePath(routes.metricsDashboard, { id }));
  };

  const isActive = path?.params?.id === id;

  return (
    <Styled.Link onClick={() => handleClick(id)} isActive={isActive}>
      <Styled.ListItem icon="metrics" marginContent="8px" isActive={isActive}>
        <Styled.Item color="light">{name}</Styled.Item>
      </Styled.ListItem>
    </Styled.Link>
  );
};

export default memo(MenuItem);
