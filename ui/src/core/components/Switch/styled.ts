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

const Toggle = styled.i`
  position: relative;
  display: inline-block;
  width: 24px;
  height: 15px;
  background-color: ${({ theme }) => theme.switch.border};
  border-radius: 23px;
  vertical-align: text-bottom;
  transition: all 0.3s linear;

  ::before {
    content: '';
    position: absolute;
    left: 0;
    width: 20px;
    height: 11px;
    background-color: ${({ theme }) => theme.switch.background};
    border-radius: 11px;
    transform: translate3d(2px, 2px, 0) scale3d(1, 1, 1);
    transition: all 0.25s linear;
  }

  ::after {
    content: '';
    position: absolute;
    left: 1px;
    top: 1px;
    width: 9px;
    height: 9px;
    background-color: ${({ theme }) => theme.switch.toggle.background};
    border-radius: 11px;
    box-shadow: 0 2px 2px ${({ theme }) => theme.switch.shadow};
    transform: translate3d(2px, 2px, 0);
    transition: all 0.2s ease-in-out;
  }
`;

const Input = styled.input`
  display: none;

  :checked + ${Toggle} {
    background-color: ${({ theme }) => theme.switch.active.background};
  }

  :checked + ${Toggle}::before {
    transform: translate3d(10px, 2px, 0) scale3d(0, 0, 0);
  }

  :checked + ${Toggle}::after {
    transform: translate3d(12px, 2px, 0);
  }
`;

const Switch = styled.label`
  display: inline-block;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;

  > :last-child {
    margin-left: 3px;
  }

  :active {
    ${Input}:checked + ${Toggle}::after {
      transform: translate3d(2px, 2px, 0);
    }

    ${Toggle}::after {
      width: 10px;
      transform: translate3d(2px, 2px, 0);
    }
  }
`;

export default {
  Switch,
  Input,
  Toggle
};
