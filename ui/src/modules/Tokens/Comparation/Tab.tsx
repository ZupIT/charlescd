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
import { useFind, useRevoke, useRegenerate } from '../hooks';
import { resolveParams } from './helpers';
import ModalRevoke from './Modal/Revoke';
import ModalRegenerate from './Modal/Regenerate';
import ModalCopy from './Form/Modal';
import Loader from './Loaders';
import Styled from './styled';

interface Props {
  param: string;
}

const Tab = ({ param }: Props) => {
  const history = useHistory();
  const [id, mode] = resolveParams(param);
  const [isRevoke, setIsRevoke] = useState<boolean>();
  const [isRegenerate, setIsRegenerate] = useState<boolean>();
  const [isNewToken, setIsNewToken] = useState<boolean>();
  const [token, setToken] = useState<Token>(null);
  const { getById, response } = useFind();
  const { revokeById, status: revokeStatus } = useRevoke();
  const { regenerateById, response: regenerated, status } = useRegenerate();
  const isLoading = isEmpty(token) && id !== NEW_TAB;

  const toggleRevoke = () => setIsRevoke(!isRevoke);

  useEffect(() => {
    if (response) {
      setToken(response);
    }
  }, [response, setToken]);

  useEffect(() => {
    if (revokeStatus === 'resolved') {
      delParam('token', routes.tokensComparation, history, param);
    }
  }, [revokeStatus, history, param]);

  useEffect(() => {
    if (id !== NEW_TAB) {
      getById(id);
    }
  }, [id, getById]);

  useEffect(() => {
    if (regenerated && status === 'resolved') {
      setIsNewToken(true);
      setIsRegenerate(false);
    }
  }, [regenerated, status]);

  const handleRevoke = () => {
    revokeById(id);
  };

  const handleRegenerate = () => {
    regenerateById(id);
  };

  const renderTabs = () => (
    <Styled.Tab>
      <Form mode={mode} data={response} />
    </Styled.Tab>
  );

  const renderActions = () => (
    <Styled.Actions>
      {mode === 'view' && (
        <Fragment>
          <LabeledIcon
            icon="revoke"
            marginContent="5px"
            onClick={toggleRevoke}
          >
            <Text.h5 color="dark">Revoke token</Text.h5>
          </LabeledIcon>
          <LabeledIcon
            icon="regenerate"
            marginContent="5px"
            onClick={() => setIsRegenerate(true)}
          >
            <Text.h5 color="dark">Regenerate token</Text.h5>
          </LabeledIcon>
        </Fragment>
      )}
    </Styled.Actions>
  );

  const ModalNewToken = () => (
    <ModalCopy
      title="Your token has been regenerated!"
      description="You can now use the token according to the settings you have created."
      token={regenerated?.token}
      onClose={() => setIsNewToken(false)}
    />
  );

  return (
    <Styled.Tab>
      {isRevoke && (
        <ModalRevoke
          onClose={toggleRevoke}
          onContinue={handleRevoke}
          isLoading={revokeStatus === 'pending'}
        />)}
      {isRegenerate && (
        <ModalRegenerate
          onClose={() => setIsRegenerate(false)}
          onContinue={handleRegenerate}
          isLoading={status === 'pending'}
        />
      )}
      {isNewToken && <ModalNewToken />}
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
