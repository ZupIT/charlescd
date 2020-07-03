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
import Styled from './styled';

const Circles = () => {
  return (
    <>
      <Styled.Content>
        <Styled.MiniCard>
          <Styled.CirclesData color="light">32</Styled.CirclesData>
          <Styled.CirclesDataDetail>
            <Text.h4 color="light">Actives: 20</Text.h4>
            <Text.h4 color="light">Inactives: 12</Text.h4>
          </Styled.CirclesDataDetail>
        </Styled.MiniCard>
        <Styled.MiniCard>
          <Styled.CirclesData>
            <Text.h4 color="light">Average life time</Text.h4>
            <Text.h1 color="light">25 days</Text.h1>
          </Styled.CirclesData>
        </Styled.MiniCard>
      </Styled.Content>
      <Styled.Content>
        <Styled.History>
          <Text.h2 color="dark" weight="bold">
            History
          </Text.h2>
          <Text.h5 color="dark">Active: 20</Text.h5>
          <Text.h5 color="dark">Inactive: 12</Text.h5>
        </Styled.History>
      </Styled.Content>
    </>
  );
};

export default Circles;
