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

import React, { useEffect } from 'react';
import Text from 'core/components/Text';
import { useDeployMetric } from './hooks';
// import Loader from '../Loaders/index';
import averageTimeOptions from './averageTime.options';
import deployOptions from './deploy.options';
import Styled from './styled';
import { timestampFormater } from '../helpers';

const Deploys = () => {
  // const [series, workerHook] = useWorker<[]>(metricWorker, []);
  const { searchDeployMetrics, response, loading } = useDeployMetric();

  const deploySeries = [
    {
      name: 'Deploy',
      data: [40, 49, 69, 56, 18, 25, 47, 55, 61, 43]
    },
    {
      name: 'Error',
      data: [18, 11, 1, 4, 13, 7, 2, 12, 8, 5]
    }
  ];

  const averageTimeSeries = [
    {
      name: 'Elapse time',
      data: [40, 49, 69, 56, 18, 25, 47, 55, 61, 43]
    }
  ];

  const period = 'ONE_WEEK';
  const circles = 'b49ba0b3-4e8e-46cf-a526-9f7c6d46fc7b';

  const onSubmit = () => {
    searchDeployMetrics({ period, circles });
  };

  return (
    <Styled.Content>
      <Styled.Card width="531px" height="79px">
        Filters
        <button onClick={() => onSubmit()}>
          <span> asdf </span>
        </button>
      </Styled.Card>
      <Styled.Plates>
        <Styled.Card width="175px" height="94px">
          <Text.h4 color="dark">Deploy</Text.h4>
          <Text.h1 color="light">
            {response?.successfulDeploymentsQuantity}
          </Text.h1>
        </Styled.Card>
        <Styled.Card width="175px" height="94px">
          <Text.h4 color="dark">Error</Text.h4>
          <Text.h1 color="light">{response?.failedDeploymentsQuantity}</Text.h1>
        </Styled.Card>
        <Styled.Card width="175px" height="94px">
          <Text.h4 color="dark">Average time</Text.h4>
          <Text.h1 color="light">
            {timestampFormater(
              response?.successfulDeploymentsAverageTimeInSeconds
            )}
          </Text.h1>
        </Styled.Card>
      </Styled.Plates>
      <Styled.Card width="1220px" height="521px">
        <Text.h2 color="light" weight="bold">
          Deploy
        </Text.h2>
        <Styled.Chart
          options={deployOptions}
          series={deploySeries}
          width={1180}
          height={450}
        />
      </Styled.Card>
      <Styled.Card width="1220px" height="521px">
        <Text.h2 color="light" weight="bold">
          Average time
        </Text.h2>
        <Styled.Chart
          options={averageTimeOptions}
          series={averageTimeSeries}
          width={1180}
          height={450}
        />
      </Styled.Card>
    </Styled.Content>
  );
};

export default Deploys;
