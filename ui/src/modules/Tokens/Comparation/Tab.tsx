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

import { useState, useEffect, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import TabPanel from 'core/components/TabPanel';
import LabeledIcon from 'core/components/LabeledIcon';
import Text from 'core/components/Text';
import routes from 'core/constants/routes';
import { delParam } from 'core/utils/path';
import { NEW_TAB } from 'core/components/TabPanel/constants';
import Form from './Form';
import { Token } from '../interfaces';
import { useFind, useRemove } from '../hooks';
import { resolveParams } from './helpers';
// import FormModule from './Form';
// import ViewModule from './View';
import ModalRevoke from './Modal/Revoke';
// import ModalRegenerate from './Modal/Regenerate';
import Loader from './Loaders';
import Styled from './styled';

interface Props {
  param: string;
}

const Tab = ({ param }: Props) => {
  const history = useHistory();
  const [id, mode] = resolveParams(param);
  const [isRevoke, setIsRevoke] = useState<boolean>();
  // const [isRegenerate, setIsRegenerate] = useState<boolean>();
  const [token, setToken] = useState<Token>(null);
  const { getById, response } = useFind();
  const { removeById } = useRemove();
  const isLoading = isEmpty(token) && id !== NEW_TAB;

  const toggleRevoke = () => setIsRevoke(!isRevoke);
  // const toggleRegenerate = () => setIsRegenerate(!isRegenerate);

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

  const handleRemove = () => {
    toggleRevoke();
    removeById(id);
  };

  const renderTabs = () => (
    <Styled.Tab>
      <Form mode={mode} />
    </Styled.Tab>
  );

  const renderActions = () => (
    <Styled.Actions>
      {mode === 'view' && (
        <Fragment>
          {/* <LabeledIcon
            icon="revoke"
            marginContent="5px"
            onClick={toggleRegenerate}
          >
            <Text.h5 color="dark">Regenerate token</Text.h5>
          </LabeledIcon> */}
          <LabeledIcon
            icon="revoke"
            marginContent="5px"
            onClick={toggleRevoke}
          >
            <Text.h5 color="dark">Revoke token</Text.h5>
          </LabeledIcon>
        </Fragment>
      )}
    </Styled.Actions>
  );

  return (
    <Styled.Tab>
      {isRevoke && <ModalRevoke onClose={toggleRevoke} onContinue={handleRemove} />}
      {/* {isRegenerate && <ModalRegenerate onClose={toggleRegenerate} />} */}
      <TabPanel
        name="token"
        title={token?.name}
        onClose={() =>
          delParam('token', routes.tokensComparation, history, param)
        }
        actions={renderActions()}
        size="15px"
      >
        {isLoading ? <Loader.Tab /> : renderTabs()}
      </TabPanel>
    </Styled.Tab>
  );
};

export default Tab;
