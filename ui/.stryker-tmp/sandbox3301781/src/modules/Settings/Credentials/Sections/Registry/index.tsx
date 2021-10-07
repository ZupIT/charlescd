// @ts-nocheck
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
import isEqual from 'lodash/isEqual';
import CardConfig from 'core/components/Card/Config';
import { Configuration } from 'modules/Workspaces/interfaces/Workspace';
import Section from 'modules/Settings/Credentials/Section';
import Layer from 'modules/Settings/Credentials/Section/Layer';
import { useDeleteRegistry, useRegistryValidateConnection } from './hooks';
import { FORM_REGISTRY } from './constants';
import FormRegistry from './Form';
import { FetchStatuses } from 'core/providers/base/hooks';
import NotificationLog from 'core/components/Notification/Log';
interface Props {
  form: string;
  setForm: Function;
  onChange: () => void;
  data: Configuration;
}

const SectionRegistry = ({ form, setForm, onChange, data }: Props) => {
  const [status, setStatus] = useState<FetchStatuses>('idle');
  const isLoading = status === 'pending';
  const [isAction, setIsAction] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);
  const { deleteRegistry, status: statusDeleteRegistry } = useDeleteRegistry();
  const {
    validateConnectionRegistry,
    response,
    error,
  } = useRegistryValidateConnection();

  const onRemoveRegistry = async () => {
    try {
      await deleteRegistry();
      setIsAction(true);
      onChange();
    } catch (e) {}
  };

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
    <NotificationLog type="error" content={error.message} />
  );

  const renderSection = () => (
    <Section
      name="Registry"
      icon="server"
      showAction={isAction}
      action={() => setForm(FORM_REGISTRY)}
      type="Required"
    >
      {data && (
        <Fragment>
          <CardConfig
            icon="server"
            description={data.name}
            isLoading={statusDeleteRegistry === 'pending' || isLoading}
            isDisabled={isDisabled}
            onClose={() => onRemoveRegistry()}
          >
            {error && renderError()}
          </CardConfig>
        </Fragment>
      )}
    </Section>
  );

  const renderForm = () =>
    isEqual(form, FORM_REGISTRY) && (
      <Layer action={() => setForm(null)}>
        <FormRegistry
          onFinish={() => {
            setForm(null);
            onChange();
          }}
        />
      </Layer>
    );

  return form ? renderForm() : renderSection();
};

export default SectionRegistry;
