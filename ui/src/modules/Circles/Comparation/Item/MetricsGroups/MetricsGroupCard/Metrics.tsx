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
import ReactTooltip from 'react-tooltip';
import Text from 'core/components/Text';
import Icon from 'core/components/Icon';
import NewDropDown from 'core/components/Dropdown/NewDropDown';
import Dropdown from 'core/components/Dropdown';
import isEmpty from 'lodash/isEmpty';
import Styled from './styled';
import { Metric, MetricsGroup } from '../types';
import { getThresholdStatus } from '../helpers';

interface Props {
  metric: Metric;
  metricGroup: MetricsGroup;
  handleDeleteMetric: Function;
  handleEditMetric: Function;
}

const MetricCard = ({
  metric,
  metricGroup,
  handleDeleteMetric,
  handleEditMetric
}: Props) => {
  const thresholdStatus = getThresholdStatus(metric.execution.status);

  const getMetricCondition = (condition: string) => {
    const textByCondition = {
      EQUAL: 'Equal:',
      GREATER_THAN: 'Greater than:',
      LOWER_THAN: 'Lower than:'
    } as Record<string, string>;

    return textByCondition[condition] ?? 'Not configured';
  };

  return (
    <Styled.MetricCardBody
      key={metric.id}
      data-testid={`metric-group-card-${metric.nickname}`}
    >
      <Styled.MetricNickname
        color="light"
        title={metric.nickname}
        data-testid={`${metric.nickname}-nickname`}
      >
        {metric.nickname}
      </Styled.MetricNickname>
      <Styled.MetricConditionThreshold>
        <Text.h5
          color="dark"
          data-testid={`${metric.nickname}-threshold-condition`}
        >
          {getMetricCondition(metric.condition)}
        </Text.h5>
        <Text.h5 color="light" title={metric.threshold.toString()}>
          {metric.threshold !== 0 && metric.threshold}
        </Text.h5>
      </Styled.MetricConditionThreshold>
      <Styled.MetricLastValue
        color={thresholdStatus.color}
        hasTreshold={isEmpty(metric.condition)}
        data-testid={`${metric.nickname}-threshold-last-value`}
      >
        <Icon
          name={thresholdStatus.icon}
          data-tip
          data-for={`thresholdTooltip-${metric.id}`}
        />
        <Styled.MetricLastValueText
          color="light"
          title={metric.execution.lastValue.toString()}
        >
          {metric.execution.lastValue}
        </Styled.MetricLastValueText>
        {!isEmpty(metric.condition) && (
          <ReactTooltip id={`thresholdTooltip-${metric.id}`} place="left">
            {thresholdStatus.message}
          </ReactTooltip>
        )}
      </Styled.MetricLastValue>
      <Styled.MetricDropdown>
        <NewDropDown icon="vertical-dots" size="16px">
          <Dropdown.Item
            icon="edit"
            name="Edit metric"
            onClick={() => handleEditMetric(metric, metricGroup)}
          />
          <Dropdown.Item
            icon="delete"
            name="Delete"
            onClick={() => handleDeleteMetric(metricGroup.id, metric.id)}
          />
        </NewDropDown>
      </Styled.MetricDropdown>
    </Styled.MetricCardBody>
  );
};

export default MetricCard;
