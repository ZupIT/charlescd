import React, { useEffect, useState } from 'react';

import map from 'lodash/map';
import Text from 'core/components/Text';
import { AreaChart } from 'core/components/Charts';
import { PERIODS } from './constants';
import { METRICS_TYPE, CHART_TYPE, PROJECTION_TYPE } from './enums';
import metricOptions from './metric.options';
import useWorker from './useWorker';
import metricWorker from './metricWorker';
import Styled from './styled';
import { getChartColor } from './helpers';

interface Props {
  id: string;
  metricType: METRICS_TYPE;
  chartType: CHART_TYPE;
  className?: string;
}

const CircleMetrics = ({ id, metricType, chartType, className }: Props) => {
  const [projectionType, setProjectionType] = useState(
    PROJECTION_TYPE.FIVE_MINUTES
  );
  const [series, workerHook] = useWorker<[]>(metricWorker, []);
  const colors = getChartColor(metricType, chartType);
  const options = { ...metricOptions, colors };

  useEffect(() => {
    workerHook({
      circleId: id,
      metricType,
      projectionType,
      chartType
    });
  }, [id, metricType, projectionType, chartType, workerHook]);

  return (
    <Styled.Wrapper
      className={className}
      data-testid={`circle-metric-${id}`}
      onClick={e => e.stopPropagation()}
    >
      <AreaChart options={options} series={series} />
      <Styled.Controls>
        {map(PERIODS, ({ value, label, type }) => (
          <Styled.ControlItem
            key={value}
            isActive={type === projectionType}
            onClick={() => setProjectionType(type)}
            data-testid={`circle-metric-control-${value}${label}`}
          >
            <Text.h6 align="center">{`${value} ${label}`}</Text.h6>
          </Styled.ControlItem>
        ))}
      </Styled.Controls>
    </Styled.Wrapper>
  );
};

export default CircleMetrics;
