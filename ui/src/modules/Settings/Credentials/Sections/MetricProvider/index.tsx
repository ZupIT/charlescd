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
import Card from 'core/components/Card';
import Section from 'modules/Settings/Credentials/Section';
import Layer from 'modules/Settings/Credentials/Section/Layer';
import { useDatasource } from './hooks';
import { FORM_METRIC_PROVIDER } from './constants';
import { Datasource } from './interfaces';
import FormMetricProvider from './Form';
import { map } from 'lodash';

interface Props {
  form: string;
  setForm: Function;
  data: Datasource[];
}

const MetricProvider = ({ form, setForm, data }: Props) => {
  const [datasources] = useState(data);
  const { remove, loadingRemove } = useDatasource();

  const renderSection = () => (
    <Section
      name="Datasources"
      icon="metrics"
      showAction
      action={() => setForm(FORM_METRIC_PROVIDER)}
    >
      {map(datasources, datasource => (
        <Card.Config
          key={datasource.id}
          icon="metrics"
          description={datasource.name}
          isLoading={loadingRemove}
          onClose={() => remove(datasource.id)}
        />
      ))}
    </Section >
  );

  const renderForm = () =>
    isEqual(form, FORM_METRIC_PROVIDER) && (
      <Layer action={() => setForm(null)}>
        <FormMetricProvider onFinish={() => setForm(null)} />
      </Layer>
    );

  return form ? renderForm() : renderSection();
};

export default MetricProvider;
