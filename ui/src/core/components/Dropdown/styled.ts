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
import { scaleIn } from 'core/assets/style/animate';

const Wrapper = styled.div`
  position: relative;
  width: auto;
  height: auto;
`;

const Dropdown = styled.div`
  animation: ${scaleIn} 0.15s cubic-bezier(0.2, 0, 0.13, 1.5);
  position: absolute;
  background: ${({ theme }) => theme.dropdown.background};
  border-radius: 4px;
  width: 136px;
  right: 8px;
  top: 27px;
  box-shadow: 0px 2px 10px 0px ${({ theme }) => theme.dropdown.shadow};
  display: flex;
  overflow-y: auto;
  justify-content: flex-start;
  flex-direction: column;
  z-index: ${({ theme }) => theme.zIndex.OVER_3};
`;

export default {
  Wrapper,
  Dropdown
};
