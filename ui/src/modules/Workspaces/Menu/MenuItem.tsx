/*
 * Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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

import { useHistory } from 'react-router-dom';
import { saveWorkspace } from 'core/utils/workspace';
import { setUserAbilities } from 'core/utils/abilities';
import { hasPermission } from 'core/utils/auth';
import { WORKSPACE_STATUS } from '../enums';
import routes from 'core/constants/routes';
import Styled from './styled';
import { Workspace } from '../interfaces/Workspace';

interface Props {
  workspace: Workspace;
}

const MenuItem = ({ workspace }: Props) => {
  const history = useHistory();

  const handleClick = () => {
    saveWorkspace({ ...workspace });
    setUserAbilities();
    history.push({
      pathname:
        workspace?.status === WORKSPACE_STATUS.INCOMPLETE &&
        hasPermission('maintenance_write')
          ? routes.credentials
          : routes.circles,
    });
  };

  return (
    <Styled.Link
      onClick={handleClick}
      data-testid={`workspace-${workspace.name}`}
    >
      <Styled.ListItem icon="workspace">
        <Styled.Item tag="H4" color="light" title={workspace.name}>
          {workspace.name}
        </Styled.Item>
      </Styled.ListItem>
    </Styled.Link>
  );
};

export default MenuItem;
