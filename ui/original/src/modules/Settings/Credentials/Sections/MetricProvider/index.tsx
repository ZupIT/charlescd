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

import { useEffect, useState } from 'react';
import isEqual from 'lodash/isEqual';
import map from 'lodash/map';
import CardConfig from 'core/components/Card/Config';
import Section from 'modules/Settings/Credentials/Section';
import Layer from 'modules/Settings/Credentials/Section/Layer';
import { useDeleteDatasource } from './hooks';
import { FORM_METRIC_PROVIDER } from './constants';
import { Datasource } from './interfaces';
import FormMetricProvider from './Form';

interface Props {
  form: string;
  setForm: Function;
  data: Datasource[];
  getNewDatasources: Function;
}

const MetricProvider = ({ form, setForm, data, getNewDatasources }: Props) => {
  const [datasources, setDatasource] = useState(data);
  const { removeDatasource, status } = useDeleteDatasource();

  const handleClose = async (id: string) => {
    await removeDatasource(id);
    getNewDatasources();
  };

  const handleOnFinish = () => {
    setForm(null);
    getNewDatasources();
  };

  useEffect(() => {
    if (data !== datasources) {
      setDatasource(data);
    }
  }, [data, datasources, form]);

  const renderSection = () => (
    <Section
      id="datasources"
      name="Datasources"
      icon="metrics"
      showAction
      action={() => setForm(FORM_METRIC_PROVIDER)}
      type="Optional"
    >
      {map(datasources, (datasource) => (
        <CardConfig
          key={datasource.id}
          icon="metrics"
          description={datasource.name}
          isLoading={status === 'pending'}
          onClose={() => handleClose(datasource.id)}
        />
      ))}
    </Section>
  );

  const renderForm = () =>
    isEqual(form, FORM_METRIC_PROVIDER) && (
      <Layer action={() => setForm(null)}>
        <FormMetricProvider onFinish={handleOnFinish} />
      </Layer>
    );

  return form ? renderForm() : renderSection();
};

export default MetricProvider;
