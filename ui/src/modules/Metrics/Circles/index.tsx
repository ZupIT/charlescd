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
import { humanizeDurationFromSeconds } from 'core/utils/date';
import Text from 'core/components/Text';
import HistoryComponent from './History';
import Loader from '../Loaders/index';
import { useCircles } from './hooks';
import Styled from './styled';

const Circles = () => {
  const { findAllCirclesData, response, loading } = useCircles();
  const totalCircles =
    response?.circleStats?.active + response?.circleStats?.inactive;

  useEffect(() => {
    findAllCirclesData();
  }, [findAllCirclesData]);

  return (
    <>
      <Styled.Content data-testid="metrics-circles">
        <Styled.MiniCard>
          {loading ? (
            <Loader.CircleCard />
          ) : (
            <>
              <Styled.CirclesData tag='H1' color="light">
                {`${totalCircles}`}
              </Styled.CirclesData>
              <Styled.CirclesDataDetail>
                <Text tag='H4' color="light">
                  Actives: {response?.circleStats?.active}
                </Text>
                <Text tag='H4' color="light">
                  Inactives: {response?.circleStats?.inactive}
                </Text>
              </Styled.CirclesDataDetail>
            </>
          )}
        </Styled.MiniCard>
        <Styled.MiniCard>
          <Styled.CirclesData tag='H1'>
            <Text tag='H4' color="light">Average life time</Text>
            <Text tag='H1' color="light">
              {loading ? (
                <Loader.CircleAverageTime />
              ) : (
                `${humanizeDurationFromSeconds(response?.averageLifeTime)}`
              )}
            </Text>
          </Styled.CirclesData>
        </Styled.MiniCard>
      </Styled.Content>
      <Styled.Content>
        <HistoryComponent />
      </Styled.Content>
    </>
  );
};

export default Circles;
