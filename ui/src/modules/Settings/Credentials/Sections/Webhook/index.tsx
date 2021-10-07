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

import React, { useEffect, useState } from 'react';
import isEqual from 'lodash/isEqual';
import map from 'lodash/map';
import toString from 'lodash/toString';
import CardMain from 'core/components/Card/Main';
import Dropdown from 'core/components/Dropdown';
import Icon from 'core/components/Icon';
import { HTTP_STATUS } from 'core/enums/HttpStatus';
import { themeByHttpCode } from 'core/utils/http';
import Section from 'modules/Settings/Credentials/Section';
import Layer from 'modules/Settings/Credentials/Section/Layer';
import FormWebhook from './Form';
import { useWebhook } from './hooks';
import { FORM_WEBHOOK } from './constants';
import { Webhook } from './interfaces';

interface Props {
  form: string;
  setForm: Function;
  data?: Webhook[];
  onSave: () => void;
}

const SectionWebhook = ({ form, setForm, onSave, data }: Props) => {
  const [webhooks, setWebhooks] = useState<Webhook[]>(data);
  const [webhook, setWebhook] = useState<Webhook>();
  const { remove } = useWebhook();

  useEffect(() => {
    if (webhooks !== data) {
      setWebhooks(data);
    }
  }, [webhooks, data]);

  useEffect(() => {
    if (form === null) {
      setWebhook(null);
    }
  }, [form]);

  const getStatus = (status: number): string =>
    status === HTTP_STATUS.teapot ? '' : toString(status);

  const onDelete = async (id: string) => {
    await remove(id);
    onSave();
  };

  const onEdit = async (webhook: Webhook) => {
    setWebhook(webhook);
    setForm(FORM_WEBHOOK);
  };

  const renderAction = (webhook: Webhook) => (
    <Dropdown color="light">
      <Dropdown.Item icon="edit" name="Edit" onClick={() => onEdit(webhook)} />
      <Dropdown.Item
        icon="delete"
        name="Delete"
        onClick={() => onDelete(webhook.id)}
      />
    </Dropdown>
  );

  const renderHeader = () => <Icon name="webhook" color="dark" size="15px" />;

  const renderSection = () => (
    <Section
      name="Webhook"
      icon="webhook"
      type="Optional"
      showAction
      action={() => setForm(FORM_WEBHOOK)}
    >
      {webhooks &&
        map(webhooks, (webhook) => (
          <CardMain
            key={webhook.id}
            title={webhook.description}
            description={webhook.url}
            header={renderHeader()}
            action={renderAction(webhook)}
          >
            <CardMain
              width="237px"
              title={getStatus(webhook.lastDelivery?.status)}
              description={webhook.lastDelivery?.details}
              color={themeByHttpCode(webhook.lastDelivery?.status)}
            />
          </CardMain>
        ))}
    </Section>
  );

  const renderForm = () =>
    isEqual(form, FORM_WEBHOOK) && (
      <Layer action={() => setForm(null)}>
        <FormWebhook
          onFinish={() => {
            onSave();
            setForm(null);
          }}
          data={webhook}
        />
      </Layer>
    );

  return form ? renderForm() : renderSection();
};

export default SectionWebhook;
