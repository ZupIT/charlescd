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

import React, { useState, useEffect, Fragment } from 'react';
import isEqual from 'lodash/isEqual';
import Card from 'core/components/Card';
import { Configuration } from 'modules/Workspaces/interfaces/Workspace';
import Section from 'modules/Settings/Credentials/Section';
import Layer from 'modules/Settings/Credentials/Section/Layer';
import { useRegistry, useRegistryValidateConnection } from './hooks';
import { FORM_REGISTRY } from './constants';
import FormRegistry from './Form';
import { FetchStatuses } from 'core/providers/base/hooks';
import Notification from 'core/components/Notification';
interface Props {
  form: string;
  setForm: Function;
  data: Configuration;
}

const SectionRegistry = ({ form, setForm, data }: Props) => {
  const [status, setStatus] = useState<FetchStatuses>('idle');
  const isLoading = status === 'pending';
  const [isAction, setIsAction] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);
  const { remove, responseRemove, loadingRemove } = useRegistry();
  const {
    validateConnectionRegistry,
    response,
    error
  } = useRegistryValidateConnection();

  useEffect(() => {
    setIsAction(true);
  }, [responseRemove]);

  useEffect(() => {
    if (response) {
      setIsDisabled(false);
    }
  }, [response]);

  useEffect(() => {
    if (error) {
      setIsDisabled(true);
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setIsAction(false);

      (async () => {
        setStatus('pending');
        await validateConnectionRegistry(data.id);
        setStatus('resolved');
      })();
    }
  }, [validateConnectionRegistry, data]);

  const renderError = () => (
    <Notification.Log type="error" content={error.message} />
  );

  const renderSection = () => (
    <Section
      name="Registry"
      icon="server"
      showAction={isAction}
      action={() => setForm(FORM_REGISTRY)}
      type="Required"
    >
      {data && !responseRemove && (
        <Fragment>
          <Card.Config
            icon="server"
            description={data.name}
            isLoading={loadingRemove || isLoading}
            isDisabled={isDisabled}
            onClose={() => remove(data?.id)}
          >
            {error && renderError()}
          </Card.Config>
        </Fragment>
      )}
    </Section>
  );

  const renderForm = () =>
    isEqual(form, FORM_REGISTRY) && (
      <Layer action={() => setForm(null)}>
        <FormRegistry onFinish={() => setForm(null)} />
      </Layer>
    );

  return form ? renderForm() : renderSection();
};

export default SectionRegistry;
