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
import Loader from '../Loaders/index';
import { useCirclesMetric } from './hooks';
import Styled from './styled';

const Circles = () => {
  const { findAllCirclesData, response, loading } = useCirclesMetric();
  const totalCircles =
    response?.circleStats?.active + response?.circleStats?.inactive;

  const onSearch = () => {
    console.log('o/');
  };

  useEffect(() => {
    findAllCirclesData();
  }, [findAllCirclesData]);

  return (
    <>
      <Styled.Content>
        <Styled.MiniCard>
          {loading ? (
            <Loader.CircleCard />
          ) : (
            <>
              <Styled.CirclesData color="light">
                {totalCircles}
              </Styled.CirclesData>
              <Styled.CirclesDataDetail>
                <Text.h4 color="light">
                  Actives: {response?.circleStats?.active}
                </Text.h4>
                <Text.h4 color="light">
                  Inactives: {response?.circleStats?.inactive}
                </Text.h4>
              </Styled.CirclesDataDetail>
            </>
          )}
        </Styled.MiniCard>
        <Styled.MiniCard>
          <Styled.CirclesData>
            <Text.h4 color="light">Average life time</Text.h4>
            <Text.h1 color="light">
              {loading ? (
                <Loader.CircleAvaregeTime />
              ) : (
                `${response?.averageCircleLifeTime} days`
              )}
            </Text.h1>
          </Styled.CirclesData>
        </Styled.MiniCard>
      </Styled.Content>
      <Styled.Content>
        <Styled.History>
          <Styled.HistoryHeader>
            <Text.h2 color="light" weight="bold">
              History
            </Text.h2>
            <Styled.HistorySearchInput
              resume
              onSearch={onSearch}
              placeholder={'Search circle'}
            />
          </Styled.HistoryHeader>
          <Styled.HistoryLegend>
            <Styled.Dot active={true} />
            <Text.h5 color="dark">
              Active: {response?.circleStats?.active}
            </Text.h5>
            <Styled.Dot active={false} />
            <Text.h5 color="dark">
              Inactive: {response?.circleStats?.inactive}
            </Text.h5>
          </Styled.HistoryLegend>
        </Styled.History>
      </Styled.Content>
    </>
  );
};

export default Circles;
