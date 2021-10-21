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
import { delParam } from 'core/utils/path';
import Styled from './styled';
import routes from 'core/constants/routes';
import TabPanel from 'core/components/TabPanel';
import Form from './Form';
import { CreateTabID } from '../constants';
import { useHistory } from 'react-router-dom';

interface Props {
  onFinish?: (createUserStatus: string) => void;
}

const CreateUser = ({ onFinish }: Props) => {
  const history = useHistory();
  const renderForm = () => (
    <Form onFinish={(createUserStatus: string) => onFinish(createUserStatus)} />
  );

  const renderPanel = () => (
    <TabPanel
      title="Create User"
      onClose={() =>
        delParam('user', routes.usersComparation, history, CreateTabID)
      }
      name="user"
      size="15px"
    >
      {renderForm()}
    </TabPanel>
  );

  return (
    <Styled.Wrapper data-testid="create-user">{renderPanel()}</Styled.Wrapper>
  );
};

export default CreateUser;
