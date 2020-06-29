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
import HealthCard from './Card';
import Styled from './styled';
import Loader from './Loaders';
import { CircleHealth } from './interfaces';
import isEmpty from 'lodash/isEmpty';

interface Props {
  id: string;
  name: string;
  circleHealthData: CircleHealth;
  className?: string;
}

const CircleHealthComponent = ({
  id,
  name,
  circleHealthData,
  className
}: Props) => {
  const renderHealth = () => (
    <Styled.Wrapper className={className} onClick={e => e.stopPropagation()}>
      <Text.h5 color="light">
        Request:{' '}
        <strong>
          {`${circleHealthData?.requests?.value} ${circleHealthData?.requests?.unit}`}
        </strong>
      </Text.h5>
      <HealthCard
        type="Latency"
        name={name}
        health={circleHealthData?.latency}
        id={id}
      />
      <HealthCard
        type="Error"
        name={name}
        health={circleHealthData?.errors}
        id={id}
      />
    </Styled.Wrapper>
  );

  return isEmpty(circleHealthData) ? <Loader.Content /> : renderHealth();
};

export default CircleHealthComponent;
