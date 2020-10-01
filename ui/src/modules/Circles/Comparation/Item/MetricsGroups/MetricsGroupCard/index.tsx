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
import { OptionTypeBase } from 'react-select';
import { useForm } from 'react-hook-form';
import Text from 'core/components/Text';
import Dropdown from 'core/components/Dropdown';
import LabeledIcon from 'core/components/LabeledIcon';
import { normalizeSelectOptionsNickname } from 'core/utils/select';
import CustomOption from 'core/components/Form/Select/CustomOptions';
import { allOption } from 'core/components/Form/Select/MultiCheck/constants';
import isUndefined from 'lodash/isUndefined';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import MonitoringMetrics from './MonitoringMetrics';
import MetricsCard from './Metrics';
import Styled from './styled';
import { MetricsGroup } from '../types';

type Props = {
  metricGroup: MetricsGroup;
  loadingStatus: boolean;
  handleAddMetric: Function;
  handleDeleteMetricsGroup: Function;
  handleDeleteMetric: Function;
  handleEditMetric: Function;
};

const MetricsGroupCard = ({
  metricGroup,
  loadingStatus,
  handleAddMetric,
  handleDeleteMetricsGroup,
  handleDeleteMetric,
  handleEditMetric
}: Props) => {
  const normalizedSelectOptions = normalizeSelectOptionsNickname(
    metricGroup.metrics
  );
  const [chartOpen, setChartOpen] = useState(false);
  const [selectMetric, setSelectMetric] = useState<OptionTypeBase[]>();
  const { control, setValue } = useForm();

  const handleChangePeriod = () => {
    if (isEmpty(selectMetric)) {
      setSelectMetric(undefined);
      setValue('metrics', [allOption, ...normalizedSelectOptions]);
    }
  };

  const handleViewChart = () => {
    setChartOpen(!chartOpen);
    setSelectMetric(undefined);
  };

  const renderLabelText = () => {
    if (isUndefined(selectMetric)) return false;
    if (isEmpty(selectMetric)) return true;

    return false;
  };

  return (
    <Styled.MetricsGroupsCard key={metricGroup.id}>
      <Styled.MetricsGroupsCardHeader>
        <Text.h2 color="light" title={metricGroup.name}>
          {metricGroup.name}
        </Text.h2>
        <Dropdown icon="vertical-dots" size="16px">
          <Dropdown.Item
            icon="add"
            name="Add metric"
            onClick={() => handleAddMetric(metricGroup)}
          />
          <Dropdown.Item
            icon="delete"
            name="Delete"
            onClick={() => handleDeleteMetricsGroup(metricGroup.id)}
          />
        </Dropdown>
      </Styled.MetricsGroupsCardHeader>
      {!isEmpty(metricGroup.metrics) && (
        <>
          <Styled.MonitoringMetricsFilter isOpen={!chartOpen}>
            <LabeledIcon
              isActive={chartOpen}
              icon={chartOpen ? 'view' : 'no-view'}
              onClick={handleViewChart}
            >
              <Text.h5 color={chartOpen ? 'light' : 'dark'}>View Chart</Text.h5>
            </LabeledIcon>
            {chartOpen && (
              <LabeledIcon icon="filter" isActive={!renderLabelText()}>
                <Styled.MultiSelect
                  control={control}
                  name="metrics"
                  isLoading={loadingStatus}
                  customOption={CustomOption.Check}
                  options={normalizedSelectOptions}
                  label={renderLabelText() && 'Select metrics'}
                  defaultValue={[allOption, ...normalizedSelectOptions]}
                  onChange={e => setSelectMetric(e)}
                />
              </LabeledIcon>
            )}
          </Styled.MonitoringMetricsFilter>
          {chartOpen && (
            <MonitoringMetrics
              metricsGroupId={metricGroup.id}
              selectFilters={selectMetric}
              onChangePeriod={handleChangePeriod}
            />
          )}
          <Styled.MetricCardTableHead>
            <Text.h5 color="dark">Nickname</Text.h5>
            <Text.h5 color="dark">Condition Threshold</Text.h5>
            <Text.h5 color="dark">Last Value</Text.h5>
          </Styled.MetricCardTableHead>
          <Styled.MetricsGroupsCardContent>
            {map(metricGroup.metrics, metric => (
              <MetricsCard
                metric={metric}
                metricGroup={metricGroup}
                key={metric.id}
                handleDeleteMetric={handleDeleteMetric}
                handleEditMetric={handleEditMetric}
              />
            ))}
          </Styled.MetricsGroupsCardContent>
        </>
      )}
    </Styled.MetricsGroupsCard>
  );
};

export default MetricsGroupCard;
