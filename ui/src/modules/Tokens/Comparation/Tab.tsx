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

import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import TabPanel from 'core/components/TabPanel';
import routes from 'core/constants/routes';
import { delParam } from 'core/utils/path';
import { NEW_TAB } from 'core/components/TabPanel/constants';
import Form from './Form';
import { Token } from '../interfaces';
import { useFind, useRemove } from '../hooks';
import { resolveParams } from './helpers';
// import FormModule from './Form';
// import ViewModule from './View';
import Loader from './Loaders';
import Styled from './styled';

interface Props {
  param: string;
}

const Tab = ({ param }: Props) => {
  const history = useHistory();
  const [id, mode] = resolveParams(param);
  const [token, setToken] = useState<Token>(null);
  const { getById, response } = useFind();
  const { removeById } = useRemove();
  const isLoading = isEmpty(token) && id !== NEW_TAB;

  useEffect(() => {
    if (response) {
      setToken(response);
    }
  }, [response, setToken]);

  useEffect(() => {
    if (id !== NEW_TAB) {
      getById(id);
    }
  }, [id, getById]);

  const renderTabs = () => (
    <Styled.Tab>
      <Form mode={mode} />
    </Styled.Tab>
  );

  return (
    <Styled.Tab>
      <TabPanel
        name="token"
        title={token?.name}
        onClose={() =>
          delParam('token', routes.tokensComparation, history, param)
        }
        size="15px"
      >
        {isLoading ? <Loader.Tab /> : renderTabs()}
      </TabPanel>
    </Styled.Tab>
  );
};

export default Tab;
