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

import React, { ReactNode } from 'react';
import { useHistory } from 'react-router-dom';
import Text from 'core/components/Text';
import LabeledIcon from 'core/components/LabeledIcon';
import routes from 'core/constants/routes';
import Styled from './styled';
import useQueryStrings from 'core/utils/query';
import { addParam, delParam } from 'core/utils/path';
import { isIDMEnabled } from 'core/utils/auth';

interface Props {
  onSearch: (name: string) => void;
  children: ReactNode;
}

const UserMenu = ({ onSearch, children }: Props) => {
  const history = useHistory();
  const query = useQueryStrings();

  const isActive = (id: string) => query.getAll('user').includes(id);

  const toggleUser = (id: string) =>
    isActive(id)
      ? delParam('user', routes.usersComparation, history, id)
      : addParam('user', routes.usersComparation, history, id);

  return (
    <>
      {!isIDMEnabled() && (
        <Styled.Actions>
          <Styled.Button onClick={() => toggleUser('create')} isActive={false}>
            <LabeledIcon icon="plus-circle" marginContent="5px">
              <Text.h5 color="dark">Create user</Text.h5>
            </LabeledIcon>
          </Styled.Button>
        </Styled.Actions>
      )}
      <Styled.SearchInput resume onSearch={onSearch} />
      <Styled.Content>{children}</Styled.Content>
    </>
  );
};

export default UserMenu;