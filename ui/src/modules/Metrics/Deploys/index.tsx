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
import Text from 'core/components/Text';
import { AreaChart } from 'core/components/Charts';
import averageTimeOptions from './averageTime.options';
import deployOptions from './deploy.options';
// import useWorker from 'core/hooks/useWorker';
// import metricWorker from './worker';
// import { getChartColor } from './helpers';
import Styled from './styled';

const Deploys = () => {
  // const [series, workerHook] = useWorker<[]>(metricWorker, []);

  const series = [
    {
      name: 'Deploy',
      data: [40, 49, 69, 56, 18, 25, 47, 55, 61, 43]
    },
    {
      name: 'Error',
      data: [18, 11, 1, 4, 13, 7, 2, 12, 8, 5]
    }
  ];

  // const colors = getChartColor(metricType, chartType);
  // const options = { ...metricOptions, colors };

  return (
    <Styled.Content>
      <Styled.Card width="531px" height="79px">
        Filters
      </Styled.Card>
      <Styled.Plates>
        <Styled.Card width="175px" height="94px">
          <Text.h4 color="dark">Deploy</Text.h4>
          <Text.h1 color="light">345</Text.h1>
        </Styled.Card>
        <Styled.Card width="175px" height="94px">
          <Text.h4 color="dark">Error</Text.h4>
          <Text.h1 color="light">12</Text.h1>
        </Styled.Card>
        <Styled.Card width="175px" height="94px">
          <Text.h4 color="dark">Average time</Text.h4>
          <Text.h1 color="light">3:26m</Text.h1>
        </Styled.Card>
      </Styled.Plates>
      <Styled.Card width="1220px" height="521px">
        <Text.h2 color="dark">Deploy</Text.h2>
        <Styled.Chart>
          <AreaChart options={deployOptions} series={series} />
        </Styled.Chart>
      </Styled.Card>
      <Styled.Card width="1220px" height="521px">
        <Text.h2 color="dark">Average time</Text.h2>
        <AreaChart options={averageTimeOptions} series={series} />
      </Styled.Card>
    </Styled.Content>
  );
};

export default Deploys;
