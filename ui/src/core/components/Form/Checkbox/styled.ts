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
import Text from 'core/components/Text';

const Toggle = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  height: 21px;
  width: 21px;
  border: 2px solid ${({ theme }) => theme.checkbox.border};
  border-radius: 4px;

  ::after {
    content: '';
    position: absolute;
    display: none;
  }
`;

const Input = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;

  :checked + ${Toggle} {
    background-color: ${({ theme }) => theme.checkbox.checked.background};
  }

  :checked + ${Toggle}::before {
    transform: translate3d(10px, 2px, 0) scale3d(0, 0, 0);
  }

  :checked + ${Toggle}::after {
    transform: rotate(45deg);
  }
`;

const Checkbox = styled.label`
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 35px;
  margin-bottom: 5px;
  cursor: pointer;
  font-size: 22px;
  user-select: none;

  :hover ${Input} ~ ${Toggle} {
    background-color: ${({ theme }) => theme.checkbox.checked.background};
  }

  ${Input}:checked ~ ${Toggle} {
    background-color: ${({ theme }) => theme.checkbox.checked.background};
  }

  ${Input}:checked ~ ${Toggle}:after {
    display: block;
  }

  ${Toggle}:after {
    left: 7px;
    top: 3px;
    width: 5px;
    height: 10px;
    border: solid ${({ theme }) => theme.checkbox.checked.mark};
    border-width: 0 3px 3px 0;
  }
`;

const Label = styled(Text.h4)`
  margin-top: 5px;
`;

const Description = styled(Text.h5)`
  margin-left: 35px;
`;

export default {
  Checkbox,
  Input,
  Toggle,
  Label,
  Description
};
