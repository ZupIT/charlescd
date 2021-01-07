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

import React, { useEffect, useState, Fragment } from 'react';
import { useForm } from 'react-hook-form';
import Button from 'core/components/Button';
import Radio from 'core/components/Radio';
import Switch from 'core/components/Switch';
import Form from 'core/components/Form';
import Text from 'core/components/Text';
import { Webhook } from './interfaces';
import { Props } from '../interfaces';
import { useWebhook } from './hooks';
import { radios } from './constants';
import Styled from './styled';

const FormWebhook = ({ onFinish }: Props) => {
  const { responseAdd, save, loadingAdd } = useWebhook();
  const [type, setType] = useState<string>('');
  const {
    register,
    handleSubmit,
    formState: { isValid }
  } = useForm<Webhook>({ mode: 'onChange' });

  useEffect(() => {
    if (responseAdd) onFinish();
  }, [onFinish, responseAdd]);

  const onSubmit = ({ url }: Webhook) => {
    save(url);
  };

  const renderOptions = () => (
    <Fragment>
      <Styled.Field>
        <Switch label="Deploy" />
        <Text.h5 color="dark">Which events branch and tag created</Text.h5>
      </Styled.Field>
      <Styled.Field>
        <Switch label="Undeploy" />
        <Text.h5 color="dark">
          Check run is created, requested, requestered or completed
        </Text.h5>
      </Styled.Field>
    </Fragment>
  );

  const renderForm = () => (
    <Styled.Form onSubmit={handleSubmit(onSubmit)}>
      <Text.h5 color="dark">
        Webhooks allow external services to be notified when certain events
        happen. When the specified events happen, we’ll send a POST request to
        each of the URLs you provide. Consult our documentation for further
        details.
      </Text.h5>
      <Styled.Fields>
        <Form.Input
          ref={register({ required: true })}
          name="description"
          label="Description"
        />
        <Form.Input
          ref={register({ required: true })}
          name="url"
          label="Webhook URL"
        />
        <Form.Password
          ref={register({ required: true })}
          name="secret"
          label="Secret"
        />
        <Text.h5 color="dark">
          Witch events would you like to trigger this webhook?
        </Text.h5>
        <Radio.Buttons
          name="type"
          items={radios}
          onChange={({ currentTarget }) => setType(currentTarget.value)}
        />
        {type === 'individual' && renderOptions()}
        <Styled.Actions>
          <Button.Default type="button" isLoading={loadingAdd}>
            Test Connection
          </Button.Default>
          <Button.Default
            type="submit"
            isDisabled={!isValid}
            isLoading={loadingAdd}
          >
            Save
          </Button.Default>
        </Styled.Actions>
      </Styled.Fields>
    </Styled.Form>
  );

  return (
    <Styled.Content>
      <Text.h2 color="light">Add Webhook</Text.h2>
      {renderForm()}
    </Styled.Content>
  );
};

export default FormWebhook;
