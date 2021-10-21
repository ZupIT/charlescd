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

import Input from 'core/components/Form/Input';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
`;

const InputWrapper = styled.div`
  cursor: pointer;
  height: 41px;
  width: 142px;
  border: 1px solid ${({ theme }) => theme.input.label};
  border-radius: 7px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;

  label {
    display: flex;
    justify-content: center;
    cursor: pointer;
    width: 100%;
    height: 100%;
    align-items: center;

    span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 130px;
    }
    svg {
      padding-left: 7px;
    }
  }
`;

const InputFile = styled(Input)`
  display: none;
`;

export default {
  Wrapper,
  InputWrapper,
  InputFile
};
