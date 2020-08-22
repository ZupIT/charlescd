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
import { useForm, FormContext } from 'react-hook-form';
import Text from 'core/components/Text';
import { Option } from 'core/components/Form/Select/interfaces';
import { conditionOptions, defaultFilterValues } from './constants';
import AceEditorForm from 'core/components/Form/AceEditor';
import { useMetricProviders, useSaveMetric, useProviderMetrics } from './hooks';
import { normalizeSelectOptions } from 'core/utils/select';
import { Metric } from './types';
import {
  normalizeMetricOptions,
  getCondition,
  getSelectDefaultValue
} from './helpers';
import BasicQueryForm from './BasicQueryForm';
import Styled from './styled';
import Button from 'core/components/Button/Default';
import isEmpty from 'lodash/isEmpty';

type Props = {
  id: string;
  onGoBack: Function;
  metric?: Metric;
};

const AddMetric = ({ onGoBack, id, metric }: Props) => {
  const formMethods = useForm<Metric>({
    mode: 'onChange',
    defaultValues: {
      ...metric,
      filters: isEmpty(metric?.filters) ? defaultFilterValues : metric.filters
    }
  });
  const {
    handleSubmit,
    register,
    control,
    formState: { isValid }
  } = formMethods;
  const [isBasicQuery, setIsBasicQuery] = useState(true);
  const { getMetricsProviders } = useMetricProviders();
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const { getAllDataSourceMetrics } = useProviderMetrics();
  const { saveMetric, status: creatingStatus } = useSaveMetric(metric?.id);
  const [providerOptions, setProviderOptions] = useState<Option[]>();
  const [metrics, setMetrics] = useState<Option[]>();
  const { watch } = formMethods;
  const watchDataSourceId = watch('dataSourceId');

  useEffect(() => {
    if (metric) {
      setIsBasicQuery(!isEmpty(metric?.filters));
    } else {
      setIsBasicQuery(true);
    }
  }, [metric]);

  useEffect(() => {
    setLoadingProviders(true);
    getMetricsProviders()
      .then(providersResponse => {
        const normalizedOptions = normalizeSelectOptions(providersResponse);
        setProviderOptions(normalizedOptions);
      })
      .finally(() => setLoadingProviders(false));
  }, [getMetricsProviders]);

  useEffect(() => {
    if (isBasicQuery && watchDataSourceId) {
      setLoadingMetrics(true);
      getAllDataSourceMetrics(watchDataSourceId)
        .then(metricsResponse => {
          const normalizedOptions = normalizeMetricOptions(metricsResponse);
          setMetrics(normalizedOptions);
        })
        .finally(() => setLoadingMetrics(false));
    }
  }, [isBasicQuery, watchDataSourceId, getAllDataSourceMetrics]);

  const onSubmit = async (data: Metric) => {
    const payload = {
      ...data,
      threshold: Number(data.threshold),
      id: metric?.id
    };
    await saveMetric(id, payload);
    onGoBack();
  };

  return (
    <>
      <Styled.Layer>
        <Styled.Icon
          name="arrow-left"
          color="dark"
          onClick={() => onGoBack()}
        />
      </Styled.Layer>
      <Styled.Layer>
        <Text.h2 color="light">
          {metric?.id ? 'Update metric' : 'Add metric'}
        </Text.h2>
      </Styled.Layer>
      <FormContext {...formMethods}>
        <Styled.Form
          onSubmit={handleSubmit(onSubmit)}
          data-testid="create-metric"
        >
          <Styled.Layer>
            <Styled.Input
              name="nickname"
              ref={register({ required: true })}
              label="Type a nickname for metric"
            />

            {!loadingProviders && (
              <Styled.ProviderSelect
                control={control}
                name="dataSourceId"
                label="Select a type server"
                options={providerOptions}
                rules={{ required: true }}
                defaultValue={getSelectDefaultValue(
                  metric?.dataSourceId,
                  providerOptions
                )}
              />
            )}
            {!loadingMetrics && (
              <Styled.ProviderSelect
                control={control}
                name="metric"
                label="Select a metric"
                options={metrics}
                defaultValue={getSelectDefaultValue(metric?.metric, metrics)}
              />
            )}

            {true && (
              <>
                <Text.h5 color="dark">
                  You can fill your query in a basic or advanced way:
                </Text.h5>
                <Styled.Actions>
                  <Styled.ButtonIconRounded
                    color="dark"
                    onClick={() => setIsBasicQuery(true)}
                    isActive={isBasicQuery}
                  >
                    Basic
                  </Styled.ButtonIconRounded>
                  <Styled.ButtonIconRounded
                    color="dark"
                    onClick={() => setIsBasicQuery(false)}
                    isActive={!isBasicQuery}
                  >
                    Advanced
                  </Styled.ButtonIconRounded>
                </Styled.Actions>

                {isBasicQuery && <BasicQueryForm filters={metric?.filters} />}

                {!isBasicQuery && (
                  <>
                    <Text.h5 color="dark">Type a query:</Text.h5>

                    <Styled.AceEditorWrapper>
                      <AceEditorForm
                        height="50px"
                        mode="json"
                        name="query"
                        control={control}
                        rules={{ required: true }}
                      />
                    </Styled.AceEditorWrapper>
                  </>
                )}

                <Styled.Title color="light">Threshold</Styled.Title>
                <Styled.Subtitle color="dark">
                  Set the threshold to indicate when to reach the configured
                  numeric value.
                </Styled.Subtitle>

                <Styled.ThresholdWrapper>
                  <Styled.ThresholdSelect
                    options={conditionOptions}
                    control={control}
                    rules={{ required: true }}
                    label="Conditional"
                    name="condition"
                    defaultValue={getCondition(metric?.condition)}
                  />

                  <Styled.InputNumber
                    name="threshold"
                    label="Threshold"
                    ref={register({ required: true })}
                  />
                </Styled.ThresholdWrapper>

                <Button
                  type="submit"
                  isLoading={creatingStatus.isPending}
                  isDisabled={!isValid}
                >
                  Save
                </Button>
              </>
            )}
          </Styled.Layer>
        </Styled.Form>
      </FormContext>
    </>
  );
};

export default AddMetric;
