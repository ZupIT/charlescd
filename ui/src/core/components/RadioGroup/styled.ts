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
import ComponentIcon from 'core/components/Icon';
import ComponentText from 'core/components/Text';

interface LabelProps {
  icon?: string;
  value: string;
}

const RadioGroup = styled.div`
  display: flex;
  flex-direction: row;

  > * + * {
    margin-left: 10px;
  }
`;

const Radio = styled.div``;

const Icon = styled(ComponentIcon)``;

const Text = styled(ComponentText.h6)``;

const Label = styled.label<LabelProps>`
  padding: ${({ icon }) =>
    icon ? '12px 30px 12px 30px' : '15px 33px 15px 33px'};
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  > * + * {
    margin-left: 5px;
  }
`;

const Input = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
  pointer-events: none;

  :checked + ${Label} {
    background-color: ${({ theme }) => theme.radio.checked.background};
    transition: 0.2s;

    :hover {
      transform: scale(1.1);
    }

    ${Icon}, ${Text} {
      color: ${({ theme }) => theme.radio.checked.color};
    }
  }

  :not(:checked) + ${Label} {
    background-color: ${({ theme }) => theme.radio.unchecked.background};
    transition: 0.2s;

    :hover {
      transform: scale(1.1);
    }

    ${Icon}, ${Text} {
      color: ${({ theme }) => theme.radio.unchecked.color};
    }
  }
`;

export default {
  Input,
  Label,
  Icon,
  Text,
  Radio,
  RadioGroup
};
