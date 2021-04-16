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

import { useHistory } from 'react-router-dom';
import Text from 'core/components/Text';
import { addParam, delParam } from 'core/utils/path';
import routes from 'core/constants/routes';
import useQueryString from 'core/utils/query';
import { isParamExists } from 'core/utils/path';
import Styled from './styled';

interface Props {
  id: string;
  name: string;
}

const MenuItem = ({ id, name }: Props) => {
  const query = useQueryString();
  const isActive = () => query.getAll('token').includes(id);
  const history = useHistory();

  const onMenuClick = () => {
    if (isParamExists('token', id)) {
      delParam('token', routes.tokensComparation, history, id);
    } else {
      addParam('token', routes.tokensComparation, history, id);
    }
  };

  return (
    <Styled.Link onClick={() => onMenuClick()} isActive={isActive()}>
      <Styled.ListItem icon="token" isActive={isActive()}>
        <Text.h4 color="light">{name}</Text.h4>
      </Styled.ListItem>
    </Styled.Link>
  );
};

export default MenuItem;
