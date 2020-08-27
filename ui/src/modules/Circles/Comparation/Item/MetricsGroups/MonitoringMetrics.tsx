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
import { getDeploySeries } from './helpers';

type Props = {
  metricsGroupId: string;
};

const MonitoringMetrics = ({ metricsGroupId }: Props) => {
  const [chartViewMode, setChartViewMode] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [chartDataLoading, setChartDataLoading] = useState(true);
  const [period, setPeriod] = useState('12h');
  const [interval, setInterval] = useState('1h');
  const { getMetricByQuery } = useMetricQuery();

  console.log(chartData);

  useEffect(() => {
    setChartDataLoading(true);
    getMetricByQuery(metricsGroupId, { period, interval })
      .then(metricByQueryResponse => {
        const series = getDeploySeries(metricByQueryResponse);
        setChartData(series);
      })
      .finally(() => setChartDataLoading(false));
  }, [getMetricByQuery, metricsGroupId, period, interval]);

  const toogleChart = () => {
    setChartViewMode(!chartViewMode);
  };

  const toogleChartPeriod = (chartPeriod: string, chartInterval: string) => {
    setPeriod(chartPeriod);
    setInterval(chartInterval);
  };

  const renderChartPeriodFilter = () => (
    <Styled.MonitoringMetricsPeriodFilter>
      <Styled.ButtonIconRoundedPeriod
        color="dark"
        onClick={() => toogleChartPeriod('12h', '1h')}
        isActive={period === '12h'}
        isDisabled={chartDataLoading}
      >
        Hour
      </Styled.ButtonIconRoundedPeriod>
      <Styled.ButtonIconRoundedPeriod
        color="dark"
        onClick={() => toogleChartPeriod('1d', '1h')}
        isActive={period === '1d'}
        isDisabled={chartDataLoading}
      >
        Day
      </Styled.ButtonIconRoundedPeriod>
      <Styled.ButtonIconRoundedPeriod
        color="dark"
        onClick={() => toogleChartPeriod('1w', '1d')}
        isActive={period === '1w'}
        isDisabled={chartDataLoading}
      >
        Week
      </Styled.ButtonIconRoundedPeriod>
      <Styled.ButtonIconRoundedPeriod
        color="dark"
        onClick={() => toogleChartPeriod('1m', '1d')}
        isActive={period === '1m'}
        isDisabled={chartDataLoading}
      >
        Mouth
      </Styled.ButtonIconRoundedPeriod>
    </Styled.MonitoringMetricsPeriodFilter>
  );

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
          <>
            <AreaChart
              options={areaChartOption}
              series={chartData}
              width={490}
              height={200}
            />
            {renderChartPeriodFilter()}
          </>
        )}
      </Styled.MonitoringMetricsContent>
    </>
  );
};

export default MonitoringMetrics;
