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
import Styled from './styled';
import areaChartOption from './areaChart.options';
import Text from 'core/components/Text';
import LabeledIcon from 'core/components/LabeledIcon';
import { AreaChart } from 'core/components/Charts';
import { useMetricQuery } from './hooks';

type Props = {
  metricsGroupId: string;
};

const MonitoringMetrics = ({ metricsGroupId }: Props) => {
  const [chartViewMode, setChartViewMode] = useState(false);
  const { getMetricByQuery, chartData, status } = useMetricQuery();

  useEffect(() => {
    if (status.isIdle) {
      getMetricByQuery(metricsGroupId, { period: '5d' });
    }
  }, [getMetricByQuery, status.isIdle, metricsGroupId]);

  const toogleChart = () => {
    console.log(chartViewMode, chartData);
    setChartViewMode(!chartViewMode);
  };

  return (
    <>
      <Styled.MonitoringMetricsFilter>
        <LabeledIcon
          icon={chartViewMode ? 'view' : 'no-view'}
          onClick={() => toogleChart()}
        >
          <Text.h5 color="dark">View Chart</Text.h5>
        </LabeledIcon>
      </Styled.MonitoringMetricsFilter>
      <Styled.MonitoringMetricsContent>
        {chartViewMode && (
          <AreaChart
            options={areaChartOption}
            series={[
              {
                name: 'series1',
                data: [31, 40, 28, 51, 42, 109, 100]
              },
              {
                name: 'series2',
                data: [11, 32, 45, 32, 34, 52, 41]
              },
              {
                name: 'series3',
                data: [0, 11, 34, 32, 21, 11, 20]
              },
              {
                name: 'series4',
                data: [2, 5, 10, 16, 34, 52, 21]
              },
              {
                name: 'series5',
                data: [7, 50, 60, 70, 80, 90, 100]
              }
            ]}
            width={490}
            height={200}
          />
        )}
      </Styled.MonitoringMetricsContent>
    </>
  );
};

export default MonitoringMetrics;
