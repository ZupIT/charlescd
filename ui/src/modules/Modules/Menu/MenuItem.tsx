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
import Text from 'core/components/Text';
import Can from 'containers/Can';
import { addParam, delParam } from 'core/utils/path';
import routes from 'core/constants/routes';
import useQueryString from 'core/utils/query';
import { isParamExists } from 'core/utils/path';
import { moduleFormatterName } from './helpers';
import Styled from './styled';

interface Props {
  id: string;
  name: string;
}

const MenuItem = ({ id, name }: Props) => {
  const query = useQueryString();
  const isActive = () => query.getAll('module').includes(id);
  const history = useHistory();

  const onMenuClick = () => {
    if (isParamExists('module', id)) {
      delParam('module', routes.modulesComparation, history, id);
    } else {
      addParam('module', routes.modulesComparation, history, id);
    }
  };

  return (
    <Can I="read" a="modules" passThrough>
      <Styled.Link onClick={() => onMenuClick()} isActive={isActive()}>
        <Styled.ListItem
          icon="modules"
          marginContent="8px"
          isActive={isActive()}
        >
          <Text.h4 color="light">{moduleFormatterName(name)}</Text.h4>
        </Styled.ListItem>
      </Styled.Link>
    </Can>
  );
};

export default MenuItem;
