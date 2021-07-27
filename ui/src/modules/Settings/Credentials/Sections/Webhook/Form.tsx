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

import { useEffect, Fragment } from 'react';
import { useForm } from 'react-hook-form';
import omit from 'lodash/omit';
import size from 'lodash/size';
import isEmpty from 'lodash/isEmpty';
import includes from 'lodash/includes';
import ButtonDefault from 'core/components/Button/ButtonDefault';
import Form from 'core/components/Form';
import Text from 'core/components/Text';
import { Webhook } from './interfaces';
import { Props } from '../interfaces';
import { EVENTS } from './constants';
import { useWebhook } from './hooks';
import Styled from './styled';
import { CHARLES_DOC } from 'core/components/Popover';
import Link from 'core/components/Link';
import { isRequired, maxLength, minLength, urlPattern } from 'core/utils/validations';

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
      ? <Text tag="H2" color="light">Edit Webhook</Text>
      : <Text tag="H2" color="light">Add Webhook</Text>
  )

  const renderOptions = () => (
    <Fragment>
      <Form.Checkbox
        {...register('events', { required: true })}
        label="Deploy"
        value="DEPLOY"
        defaultChecked={!isAllEventsChecked && includes(data?.events, 'DEPLOY')}
        description="Deploy started or finished" />
      <Form.Checkbox
        {...register('events', { required: true })}
        label="Undeploy"
        value="UNDEPLOY"
        defaultChecked={!isAllEventsChecked && includes(data?.events, 'UNDEPLOY')}
        description="Undeploy started or finished" />
    </Fragment>
  );

  const renderForm = () => (
    <Styled.Form onSubmit={handleSubmit(onSubmit)}>
      <Text tag="H5" color="dark">
        Webhooks allow external services to be notified when certain events
        happen. When the specified events happen, we’ll send a POST request to
        each of the URLs you provide.
      </Text>
      <Text tag="H5" color="dark">
        See our {' '}
        <Link href={`${CHARLES_DOC}/get-started/defining-a-workspace/web`}>
          documentation
        </Link>{' '}
        for further details.
      </Text>
      <Styled.Fields>
        <Form.Input
          {...register('description', {
            required: isRequired(),
            minLength: minLength(4),
            maxLength: maxLength(255),
          })}
          label="Description"
          disabled={isEditMode}
          defaultValue={data?.description}
          error={errors?.description?.message} />
        <Form.Input
          {...register('url', {
            required: isRequired(),
            maxLength: maxLength(1048),
            pattern: urlPattern()
          })}
          label="Webhook URL"
          disabled={isEditMode}
          defaultValue={data?.url}
          error={errors?.url?.message} />
        <Form.Password
          {...register('apiKey')}
          label="Secret (Optional)"
          disabled={isEditMode}
          autoComplete="new-password"
          defaultValue={data?.apiKey} />
        <Text tag="H5" color="dark">
          Which events would you like to trigger this webhook?
        </Text>
        <Form.Radio
          {...register('eventType', { required: true })}
          value="everything"
          label="Send me everything"
          defaultChecked={size(data?.events) === size(EVENTS) || isCreateMode} />
        <Form.Radio
          {...register('eventType', { required: true })}
          value="individual"
          label="Let me select individual events"
          defaultChecked={size(data?.events) < size(EVENTS) && isEditMode} />
        {watchEventType === 'individual' && renderOptions()}
        <ButtonDefault
          type="submit"
          isDisabled={!isValid}
          isLoading={status === 'pending'}
        >
          Save
        </ButtonDefault>
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
