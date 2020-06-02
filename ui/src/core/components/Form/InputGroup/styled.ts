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
import { HEADINGS_FONT_SIZE } from 'core/components/Text/enums';

const InputGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 40px;
  width: fit-content;
`;

const Input = styled.input`
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  border-radius: 4px;
  border: none;
  font-size: ${HEADINGS_FONT_SIZE.h5};
  background-color: ${({ theme }) => theme.input.group.input.background};
  color: ${({ theme }) => theme.input.group.input.color};

  :nth-child(2) {
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }

  :last-child {
    border-top-left-radius: 0px;
    border-top-right-radius: 4px;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 4px;
  }

  :first-child {
    border-top-left-radius: 4px;
    border-top-right-radius: 0px;
    border-bottom-left-radius: 4x;
    border-bottom-right-radius: 0px;
  }
`;

const Prepend = styled.div`
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  background-color: ${({ theme }) => theme.input.group.prepend.background};
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
`;

const Append = styled.div`
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  background-color: ${({ theme }) => theme.input.group.append.background};
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
`;

export default {
  InputGroup,
  Input,
  Prepend,
  Append
};
