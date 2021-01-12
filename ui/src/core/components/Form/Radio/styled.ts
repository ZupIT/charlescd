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

interface LabelProps {
  icon?: string;
  value: string;
}

const Radio = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  position: relative;
`;

const Label = styled.label<LabelProps>`
  padding: 10px 13px 10px 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;

  > :not(:first-child) {
    margin-top: 8px;
  }
`;

const Checkmark = styled.span`
  cursor: pointer;
  position: absolute;
  top: 5px;
  bottom: 0;
  left: 0;
  height: 20px;
  width: 20px;
  border: 1px ${({ theme }) => theme.radio.default.unchecked.checkmark} solid;
  border-radius: 50%;

  :after {
    content: '';
    position: absolute;
    display: none;
    top: 4px;
    left: 4px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }
`;

const Input = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
  pointer-events: none;
  margin: auto;

  :checked ~ ${Checkmark} {
    border: 2px ${({ theme }) => theme.radio.default.checked.checkmark} solid;
    background-color: ${({ theme }) => theme.radio.default.checked.background};

    :after {
      background-color: ${({ theme }) => theme.radio.default.checked.checkmark};
      display: block;
    }
  }

  ~ ${Checkmark} {
    border: 2px ${({ theme }) => theme.radio.default.unchecked.checkmark} solid;
  }
`;

export default {
  Input,
  Label,
  Radio,
  Checkmark
};
