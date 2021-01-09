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

import React, { ChangeEvent } from 'react';
import Styled from './styled';

interface Radio {
  name?: string;
  value: string;
}

interface Props {
  items: Radio[];
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Radio = ({ onChange }: Props) => (
  <Styled.Radio onChange={onChange}>
    <Styled.Item />
  </Styled.Radio>
);

export default Radio;
