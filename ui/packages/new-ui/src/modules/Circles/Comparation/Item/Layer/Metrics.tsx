import React, { memo, useState } from 'react';
import CircleMetrics from 'containers/Metrics';
import Text from 'core/components/Text';
import ContentIcon from 'core/components/ContentIcon';
import { METRICS_TYPE, CHART_TYPE } from 'containers/Metrics/enums';
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
  const [activeMetricType, setActiveMetricType] = useState(
    METRICS_TYPE.REQUESTS_BY_CIRCLE
  );

  const handleChangeMetricTypes = (changeType: ChangeType) => {
    const activeMetric = getActiveMetric(changeType, activeMetricType);
    setActiveMetricType(activeMetric);
  };

  return (
    <Styled.Layer>
      <Styled.MetricsTitle>
        <ContentIcon icon="metrics">
          <Text.h2 color="light">Health</Text.h2>
        </ContentIcon>
        <Styled.MetricsControl>
          <Styled.MetricsLabel>
            <Text.h5 color="light">
              {getActiveMetricDescription(activeMetricType)}
            </Text.h5>
          </Styled.MetricsLabel>
          <Styled.SortLeft
            onClick={() => handleChangeMetricTypes('INCREASE')}
          />
          <Styled.SortRight
            onClick={() => handleChangeMetricTypes('DECREASE')}
          />
        </Styled.MetricsControl>
      </Styled.MetricsTitle>
      <Styled.Content>
        <CircleMetrics
          id={id}
          metricType={activeMetricType}
          chartType={CHART_TYPE.COMPARISON}
        />
      </Styled.Content>
    </Styled.Layer>
  );
};

export default memo(LayerMetrics);
