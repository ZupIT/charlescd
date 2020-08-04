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

import React, { useState, useEffect } from 'react';
import isEqual from 'lodash/isEqual';
import Card from 'core/components/Card';
import Text from 'core/components/Text';
import Icon from 'core/components/Icon';
import { getWorkspaceId } from 'core/utils/workspace';
import { MetricConfiguration } from 'modules/Workspaces/interfaces/Workspace';
import Section from 'modules/Settings/Credentials/Section';
import Layer from 'modules/Settings/Credentials/Section/Layer';
import { useMetricProvider, useSectionTestConnection } from './hooks';
import { FORM_METRIC_PROVIDER } from './constants';
import { ConnectionStatusEnum as statusConnection } from './interfaces';
import FormMetricProvider from './Form';
import Styled from './styled';

interface Props {
  form: string;
  setForm: Function;
  data: MetricConfiguration;
}

const MetricProvider = ({ form, setForm, data }: Props) => {
  const [isAction, setIsAction] = useState(true);
  const { remove, loadingRemove, responseRemove } = useMetricProvider();
  const {
    testProviderConnectionSection,
    response
  } = useSectionTestConnection();

  useEffect(() => {
    setIsAction(true);
  }, [responseRemove]);

  useEffect(() => {
    if (data) {
      setIsAction(false);
      testProviderConnectionSection(
        { metricConfigurationId: data.id },
        getWorkspaceId()
      );
    }
  }, [data, testProviderConnectionSection]);

  const renderConnectionMessage = () => (
    <Styled.StatusWrapper status="error">
      <Icon size="10px" name="error" />
      <Text.h5>Connection to metric provider failed.</Text.h5>
    </Styled.StatusWrapper>
  );

  const renderSection = () => (
    <Section
      name="Metrics Provider"
      icon="metrics"
      showAction={isAction}
      action={() => setForm(FORM_METRIC_PROVIDER)}
    >
      {data && !responseRemove && (
        <>
          <Card.Config
            icon="metrics"
            description={data.provider}
            isLoading={loadingRemove}
            onClose={() => remove()}
          />
          {response?.status === statusConnection.FAILED &&
            renderConnectionMessage()}
        </>
      )}
    </Section>
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
