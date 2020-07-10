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
import { useHistory } from 'react-router-dom';
import { saveWorkspace } from 'core/utils/workspace';
import routes from 'core/constants/routes';
import { setUserAbilities } from 'core/utils/abilities';
import { WORKSPACE_STATUS } from '../enums';
import Styled from './styled';

interface Props {
  id: string;
  name: string;
  status: string;
}

const MenuItem = ({ id, name, status }: Props) => {
  const history = useHistory();
  const handleClick = () => {
    saveWorkspace({ id, name });
    setUserAbilities();
    history.push({
      pathname:
        status === WORKSPACE_STATUS.COMPLETE
          ? routes.circles
          : routes.credentials
    });
  };

  return (
    <Styled.Link onClick={handleClick}>
      <Styled.ListItem icon="workspace" marginContent="8px">
        <Styled.Item color="light">{name}</Styled.Item>
      </Styled.ListItem>
    </Styled.Link>
  );
};

export default memo(MenuItem);
