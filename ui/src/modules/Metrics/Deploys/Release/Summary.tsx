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
        <Text.h2 color="light" weight="bold">
          Release
        </Text.h2>
      </Styled.ReleaseHistoryHeader>
      {isLoading ? (
        <div data-testid="loader-legend">
          <Loader.Legend />
        </div>
      ) : (
        <Styled.ReleaseHistoryLegend>
          <Styled.Dot status={'deployed'} />
          <Text.h5 color="dark">Deployed: {legend?.deployed}</Text.h5>
          <Styled.Dot status={'deploying'} />
          <Text.h5 color="dark">Deploying: {legend?.deploying}</Text.h5>
          <Styled.Dot status={'error'} />
          <Text.h5 color="dark">Error: {legend?.failed}</Text.h5>
          <Styled.Dot status={'notDeployed'} />
          <Text.h5 color="dark">Undeployed: {legend?.notDeployed}</Text.h5>
          <Styled.Dot status={'undeploying'} />
          <Text.h5 color="dark">Undeploying: {legend?.undeploying}</Text.h5>
        </Styled.ReleaseHistoryLegend>
      )}
    </>
  );
};

export default Summary;
