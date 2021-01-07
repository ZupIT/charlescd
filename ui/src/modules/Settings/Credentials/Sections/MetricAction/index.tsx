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

import React from 'react';
import isEqual from 'lodash/isEqual';
import map from 'lodash/map';
import Card from 'core/components/Card';
import { Action } from './types';
import Section from 'modules/Settings/Credentials/Section';
import Layer from 'modules/Settings/Credentials/Section/Layer';
import { useDeleteAction } from './hooks';
import { FORM_METRIC_ACTION } from './constants';
import FormAddAction from './Form';

interface Props {
  form: string;
  setForm: Function;
  actions: Action[];
  getNewActions: Function;
}

const SectionMetricAction = ({
  form,
  setForm,
  actions,
  getNewActions
}: Props) => {
  const { deleteAction } = useDeleteAction();

  const handleDeleteAction = async (actionId: string) => {
    await deleteAction(actionId);
    getNewActions();
  };

  const handleOnFinish = () => {
    setForm(null);
    getNewActions();
  };

  const renderSection = () => (
    <Section
      data-testid="metric-action-section"
      name="Metric Action"
      icon="action"
      showAction
      action={() => setForm(FORM_METRIC_ACTION)}
      type="Optional"
    >
      {map(actions, action => (
        <Card.Config
          key={action.id}
          icon="action"
          description={action.nickname}
          onClose={() => handleDeleteAction(action.id)}
        />
      ))}
    </Section>
  );

  const renderForm = () =>
    isEqual(form, FORM_METRIC_ACTION) && (
      <Layer action={() => setForm(null)}>
        <FormAddAction onFinish={handleOnFinish} />
      </Layer>
    );

  return form ? renderForm() : renderSection();
};

export default SectionMetricAction;
