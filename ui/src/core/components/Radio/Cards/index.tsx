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
import map from 'lodash/map';
import { ChangeInputEvent } from 'core/interfaces/InputEvents';
import Styled from './styled';
import Radio, { RadioCard } from './Item';

export interface Props {
  items: RadioCard[];
  name: string;
  onChange?: (event: ChangeInputEvent) => void;
}

const RadioCards = ({ name, items, onChange }: Props) => {
  const renderContent = (item: RadioCard, index: number) => (
    <Radio
      key={`${name}-${index}`}
      name={name}
      data={item}
      onChange={onChange}
    />
  );

  return (
    <Styled.RadioCards data-testid={`radio-group-${name}`}>
      {map(items, (item, index) => renderContent(item, index))}
    </Styled.RadioCards>
  );
};

export default RadioCards;
