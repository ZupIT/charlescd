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

import styled from 'styled-components';
import { COLOR_BASTILLE, COLOR_WHITE } from 'core/assets/colors';

const Wrapper = styled.div`
  background-color: ${COLOR_BASTILLE};
  border-radius: 4px;
  padding-bottom: 10px;
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
`;

interface ControlItem {
  isActive?: boolean;
}

const ControlItem = styled.div<ControlItem>`
  width: 30px;
  padding: 5px;
  margin: 0 10px;
  cursor: pointer;
  border-radius: 14px;
  border: 1px solid
    ${({ isActive }) => (isActive ? COLOR_WHITE : 'transparent')};

  span {
    color: ${COLOR_WHITE};
  }
`;

export default {
  Wrapper,
  Controls,
  ControlItem
};
