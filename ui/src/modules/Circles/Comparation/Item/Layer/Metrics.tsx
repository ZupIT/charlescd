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

import React, { memo, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import Button from 'core/components/Button';
import routes from 'core/constants/routes';
import Text from 'core/components/Text';
import Layer from 'core/components/Layer';
import CircleMetrics from 'containers/Metrics/Chart';
import ContentIcon from 'core/components/ContentIcon';
import { useWorkspace } from 'modules/Settings/hooks';
import { getWorkspaceId } from 'core/utils/workspace';
import { METRICS_TYPE, CHART_TYPE } from 'containers/Metrics/Chart/enums';
import {
  getActiveMetric,
  ChangeType,
  getActiveMetricDescription
} from '../helpers';
import Styled from '../styled';

interface Props {
  id: string;
}

const LayerMetrics = ({ id }: Props) => {
  const [response, loadWorkspace] = useWorkspace();
  const [isWorkspaceLoaded, setIsWorkspaceLoaded] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (response === undefined) {
      loadWorkspace(getWorkspaceId());
    } else {
      setIsWorkspaceLoaded(true);
    }
  }, [loadWorkspace, response]);

  const [activeMetricType, setActiveMetricType] = useState(
    METRICS_TYPE.REQUESTS_BY_CIRCLE
  );

  const handleChangeMetricTypes = (changeType: ChangeType) => {
    const activeMetric = getActiveMetric(changeType, activeMetricType);
    setActiveMetricType(activeMetric);
  };

  const handleAddMetrics = () => {
    history.push(routes.credentials);
  };

  const renderMetricsControl = () => (
    <Styled.MetricsControl>
      <Styled.MetricsLabel>
        <Text.h5 color="light">
          {getActiveMetricDescription(activeMetricType)}
        </Text.h5>
      </Styled.MetricsLabel>
      <Styled.SortLeft onClick={() => handleChangeMetricTypes('INCREASE')} />
      <Styled.SortRight onClick={() => handleChangeMetricTypes('DECREASE')} />
    </Styled.MetricsControl>
  );

  const renderNoMetrics = () => (
    <Button.Rounded
      name={'add'}
      color={'dark'}
      onClick={() => handleAddMetrics()}
    >
      Add Metrics Configuration
    </Button.Rounded>
  );

  const renderContent = () => {
    return !isEmpty(response?.metricConfiguration) ? (
      <CircleMetrics
        id={id}
        metricType={activeMetricType}
        chartType={CHART_TYPE.COMPARISON}
      />
    ) : (
      renderNoMetrics()
    );
  };

  return (
    <Layer>
      <Styled.MetricsTitle>
        <ContentIcon icon="activity">
          <Text.h2 color="light">Health</Text.h2>
        </ContentIcon>
        {!isEmpty(response?.metricConfiguration) && renderMetricsControl()}
      </Styled.MetricsTitle>
      {isWorkspaceLoaded && <Styled.Content>{renderContent()}</Styled.Content>}
    </Layer>
  );
};

export default memo(LayerMetrics);
