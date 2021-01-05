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

import React, { useState } from 'react';
import isEqual from 'lodash/isEqual';
import map from 'lodash/map';
import filter from 'lodash/filter';
import Card from 'core/components/Card';
import { UserGroup } from 'modules/Groups/interfaces/UserGroups';
import Section from 'modules/Settings/Credentials/Section';
import Layer from 'modules/Settings/Credentials/Section/Layer';
import { getWorkspaceId } from 'core/utils/workspace';
import { useWebhook } from './hooks';
import { FORM_WEBHOOK } from './constants';
import FormWebhook from './Form';

interface Props {
  form: string;
  setForm: Function;
  data: UserGroup[];
}

const SectionWebhook = ({ form, setForm, data }: Props) => {
  const [webhooks, setWebhooks] = useState(data);
  const { remove, loadingRemove } = useWebhook();

  const handleClose = async (id: string) => {
    await remove(getWorkspaceId(), id);
    setWebhooks(filter(webhooks, item => item.id !== id));
  };

  const renderSection = () => (
    <Section
      name="User group"
      icon="users"
      showAction
      action={() => setForm(FORM_WEBHOOK)}
    >
      {webhooks &&
        map(webhooks, webhook => (
          <Card.Config
            key={webhook.name}
            icon="users"
            description={webhook.name}
            isLoading={loadingRemove}
            onClose={() => handleClose(webhook?.id)}
          />
        ))}
    </Section>
  );

  const renderForm = () =>
    isEqual(form, FORM_WEBHOOK) && (
      <Layer action={() => setForm(null)}>
        <FormWebhook onFinish={() => setForm(null)} />
      </Layer>
    );

  return form ? renderForm() : renderSection();
};

export default SectionWebhook;
