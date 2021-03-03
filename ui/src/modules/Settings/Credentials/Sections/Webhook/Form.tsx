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

import React, { useEffect, Fragment } from 'react';
import { useForm } from 'react-hook-form';
import omit from 'lodash/omit';
import size from 'lodash/size';
import isEmpty from 'lodash/isEmpty';
import includes from 'lodash/includes';
import Button from 'core/components/Button';
import Form from 'core/components/Form';
import Text from 'core/components/Text';
import { Webhook } from './interfaces';
import { Props } from '../interfaces';
import { EVENTS } from './constants';
import { useWebhook } from './hooks';
import Styled from './styled';
import { CHARLES_DOC } from 'core/components/Popover';
import DocumentationLink from 'core/components/DocumentationLink';
import { isRequired, maxLength, urlPattern } from 'core/utils/validations';

const FormWebhook = ({ onFinish, data }: Props<Webhook>) => {
  const { status, save, edit } = useWebhook();
  const {
    register,
    handleSubmit,
    watch,
    errors,
    formState: { isValid }
  } = useForm<Webhook>({ mode: 'onChange' });

  const isAllEventsChecked = data?.events?.length === EVENTS.length;
  const isCreateMode = isEmpty(data?.id);
  const isEditMode = !isEmpty(data?.id);
  const watchEventType = watch('eventType');

  useEffect(() => {
    if (status === 'resolved') onFinish();
  }, [onFinish, status]);

  const onSubmit = (webhook: Webhook) => {
    if (watchEventType === 'everything') {
      webhook.events = EVENTS;
    }

    if (isEditMode) {
      edit(data?.id, webhook.events);
    } else {
      save(omit(webhook, 'eventType'));
    }
  };

  const renderTitle = () => (
    isEditMode
      ? <Text.h2 color="light">Edit Webhook</Text.h2>
      : <Text.h2 color="light">Add Webhook</Text.h2>
  )

  const renderOptions = () => (
    <Fragment>
      <Form.Checkbox
        ref={register({ required: true })}
        name="events"
        label="Deploy"
        value="DEPLOY"
        defaultChecked={!isAllEventsChecked && includes(data?.events, 'DEPLOY')}
        description="Deploy started or finished"
      />
      <Form.Checkbox
        ref={register({ required: true })}
        name="events"
        label="Undeploy"
        value="UNDEPLOY"
        defaultChecked={!isAllEventsChecked && includes(data?.events, 'UNDEPLOY')}
        description="Undeploy started or finished"
      />
    </Fragment>
  );

  const renderForm = () => (
    <Styled.Form onSubmit={handleSubmit(onSubmit)}>
      <Text.h5 color="dark">
        Webhooks allow external services to be notified when certain events
        happen. When the specified events happen, we’ll send a POST request to
        each of the URLs you provide.
      </Text.h5>
      <Text.h5 color="dark">
        Consult our {' '}
          <DocumentationLink
            text="documentation"
            documentationLink={`${CHARLES_DOC}/reference/webhooks`}
          />{' '}
        for further details.
      </Text.h5>
      <Styled.Fields>
        <Form.Input
          ref={register({
            required: isRequired(),
            maxLength: maxLength(255),
          })}
          name="description"
          label="Description"
          disabled={isEditMode}
          defaultValue={data?.description}
          error={errors?.description?.message}
        />
        <Form.Input
          ref={register({
            required: isRequired(),
            maxLength: maxLength(1048),
            pattern: urlPattern()
          })}
          name="url"
          label="Webhook URL"
          disabled={isEditMode}
          defaultValue={data?.url}
          error={errors?.url?.message}
        />
        <Form.Password
          ref={register()}
          name="apiKey"
          label="Secret"
          disabled={isEditMode}
          autoComplete="new-password"
          defaultValue={data?.apiKey}
        />
        <Text.h5 color="dark">
          Witch events would you like to trigger this webhook?
        </Text.h5>
        <Form.Radio
          ref={register({ required: true })}
          name="eventType"
          value="everything"
          label="Send me everything"
          defaultChecked={size(data?.events) === size(EVENTS) || isCreateMode}
        />
        <Form.Radio
          ref={register({ required: true })}
          name="eventType"
          value="individual"
          label="Let me select individual events"
          defaultChecked={size(data?.events) < size(EVENTS) && isEditMode}
        />
        {watchEventType === 'individual' && renderOptions()}
        <Button.Default
          type="submit"
          isDisabled={!isValid}
          isLoading={status === 'pending'}
        >
          Save
        </Button.Default>
      </Styled.Fields>
    </Styled.Form>
  );

  return (
    <Styled.Content>
      {renderTitle()}
      {renderForm()}
    </Styled.Content>
  );
};

export default FormWebhook;
