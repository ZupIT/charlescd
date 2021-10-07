// @ts-nocheck
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
import Loader from '../../Loaders/index';
import { ReleaseHistorySummary } from '../interfaces';
import Styled from './styled';

type Props = {
  legend: ReleaseHistorySummary;
  isLoading: boolean;
};

const Summary = ({ legend, isLoading }: Props) => {
  return (
    <>
      <Styled.ReleaseHistoryHeader>
        <Text tag="H2" color="light" weight="bold">
          Release
        </Text>
      </Styled.ReleaseHistoryHeader>
      {isLoading ? (
        <div data-testid="loader-legend">
          <Loader.Legend />
        </div>
      ) : (
        <Styled.ReleaseHistoryLegend>
          <Styled.Dot status="deployed" />
          <Text tag="H5" color="dark">Deployed: {legend?.deployed}</Text>
          <Styled.Dot status="deploying" />
          <Text tag="H5" color="dark">Deploying: {legend?.deploying}</Text>
          <Styled.Dot status="error" />
          <Text tag="H5" color="dark">Error: {legend?.failed}</Text>
          <Styled.Dot status="notDeployed" />
          <Text tag="H5" color="dark">Undeployed: {legend?.notDeployed}</Text>
          <Styled.Dot status="undeploying" />
          <Text tag="H5" color="dark">Undeploying: {legend?.undeploying}</Text>
        </Styled.ReleaseHistoryLegend>
      )}
    </>
  );
};

export default Summary;
