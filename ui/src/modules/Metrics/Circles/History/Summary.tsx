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
import Styled from './styled';

type Props = {
  isLoading: boolean;
  onSearch: (name: string) => void;
};

const Summary = ({ isLoading, onSearch }: Props) => {
  return (
    <>
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
      {isLoading ? (
        <div data-testid="loader-legend">
          <Loader.Legend />
        </div>
      ) : (
        <Styled.HistoryLegend>
          <Styled.Dot status="active" />
          <Text.h5 color="dark">Active</Text.h5>
          <Styled.Dot status="inactive" />
          <Text.h5 color="dark">Inactive</Text.h5>
        </Styled.HistoryLegend>
      )}
    </>
  );
};

export default Summary;
