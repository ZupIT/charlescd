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
import LabeledIcon from 'core/components/LabeledIcon';
import { normalizeSelectOptionsNickname } from 'core/utils/select';
import CustomOption from 'core/components/Form/Select/CustomOptions';
import { allOption } from 'core/components/Form/Select/MultiCheck/constants';
import NavTabs from 'core/components/NavTabs';
import Button from 'core/components/Button';
import Summary from 'core/components/Summary';
import isUndefined from 'lodash/isUndefined';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import MonitoringMetrics from './MonitoringMetrics';
import MetricsCard from './MetricCard';
import ActionCard from './ActionCard';
import CardHeader from './CardHeader';
import Styled from './styled';
import { MetricsGroup } from '../types';

type Props = {
  metricGroup: MetricsGroup;
  loadingStatus: boolean;
  handleAddMetric: Function;
  handleDeleteMetricsGroup: Function;
  handleDeleteMetric: Function;
  handleEditMetric: Function;
  handleAddAction: Function;
  handleEditGroup: Function;
  handleDeleteAction: Function;
  handleEditAction: Function;
};

const MetricsGroupCard = ({
  metricGroup,
  loadingStatus,
  handleAddMetric,
  handleDeleteMetricsGroup,
  handleDeleteMetric,
  handleEditMetric,
  handleAddAction,
  handleEditGroup,
  handleDeleteAction,
  handleEditAction
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

  const renderActionContent = () => (
    <>
      <Summary>
        <Summary.Item name="Executed" color="green" />
        <Summary.Item name="Executing" color="darkBlue" />
        <Summary.Item name="Not executed" color="lightBlue" />
        <Summary.Item name="Failed" color="red" />
      </Summary>
      <Styled.ActionCardHead>
        <Text.h5 color="dark">Nickname</Text.h5>
        <Text.h5 color="dark">Type</Text.h5>
        <Text.h5 color="dark">Triggered at</Text.h5>
      </Styled.ActionCardHead>
      <Styled.MetricsGroupsCardContent>
        {map(metricGroup.actions, action => (
          <ActionCard
            action={action}
            metricGroup={metricGroup}
            key={action.id}
            handleDeleteAction={handleDeleteAction}
            handleEditAction={handleEditAction}
          />
        ))}
      </Styled.MetricsGroupsCardContent>
    </>
  );

  const renderMetricsContent = () => (
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
  );

  return (
    <Styled.MetricsGroupsCard key={metricGroup.id}>
      <CardHeader
        metricGroup={metricGroup}
        handleDeleteMetricsGroup={handleDeleteMetricsGroup}
        handleEditGroup={handleEditGroup}
      />
      <NavTabs>
        <NavTabs.Tab title="Metrics">
          {!isEmpty(metricGroup.metrics) ? (
            renderMetricsContent()
          ) : (
            <NavTabs.Placeholder
              title="No metric in this  group."
              subTitle="You can add metrics and monitor the health of your activities."
            />
          )}
          <Styled.MetricsGroupsFooter>
            <Button.Default onClick={() => handleAddMetric(metricGroup)}>
              Add metric
            </Button.Default>
          </Styled.MetricsGroupsFooter>
        </NavTabs.Tab>
        <NavTabs.Tab title="Actions">
          {!isEmpty(metricGroup.actions) ? (
            renderActionContent()
          ) : (
            <NavTabs.Placeholder
              title="No actions in this metrics group."
              subTitle="An action is an automated workflow that connects your applications and services through metrics triggers."
            />
          )}
          <Styled.MetricsGroupsFooter>
            <Button.Default onClick={() => handleAddAction(metricGroup)}>
              Add action
            </Button.Default>
          </Styled.MetricsGroupsFooter>
        </NavTabs.Tab>
      </NavTabs>
    </Styled.MetricsGroupsCard>
  );
};

export default MetricsGroupCard;
