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
import Dropdown from 'core/components/Dropdown';
import Styled from './styled';

type Props = {
  onReset: () => void;
};

const ChartMenu = ({ onReset }: Props) => (
  <Styled.ChartMenu data-testid="chart-menu">
    <Dropdown icon="horizontal-dots" size="24px">
      <Dropdown.Item icon="refresh" name="Reset" onClick={onReset} />
    </Dropdown>
  </Styled.ChartMenu>
);

export default ChartMenu;
