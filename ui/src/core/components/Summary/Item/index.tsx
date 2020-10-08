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

type Props = {
  className?: string;
  color: string;
  name: string;
};

const SummaryItem = ({ name, color, className }: Props) => (
  <Styled.Item className={className} data-testid={`summary-${color}-${name}`}>
    <Styled.Dot color={color} />
    <Text.h5 color="dark">{name}</Text.h5>
  </Styled.Item>
);

export default SummaryItem;
