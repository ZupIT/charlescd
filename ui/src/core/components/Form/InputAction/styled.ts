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
import InputComponent from 'core/components/Form/Input';
import IconComponent from 'core/components/Icon';

const Wrapper = styled.div`
  position: relative;
`;

const Input = styled(InputComponent)`
  > input {
    background-color: ${({ theme }) => theme.input.action.background};
    height: 34px;
    border: none;
    border-radius: 4px;
    font-size: 12px;
    padding: 0 35px 0 15px;
  }
`;

const Icon = styled(IconComponent)`
  background-color: ${({ theme }) => theme.input.action.background};
  padding-left: 10px;
`;

const Action = styled.button`
  background: none;
  bottom: 8px;
  border: none;
  display: flex;
  cursor: pointer;
  position: absolute;
  right: 10px;
`;

export default {
  Wrapper,
  Input,
  Icon,
  Action
};
