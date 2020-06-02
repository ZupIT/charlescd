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

import styled, { css } from 'styled-components';
import Input from 'core/components/Form/Input';

const Wrapper = styled.div`
  display: flex;
  align-items: flex-end;
`;

const InputTitle = styled(Input)`
  width: 334px;
  height: 30px;
  margin-right: 10px;

  input {
    padding-left: 10px;
    padding-top: 2px;
    height: 30px;
    background-color: ${({ theme }) => theme.input.title.background};

    ${({ resume }) =>
      resume &&
      css`
        height: auto;
        cursor: pointer;
        padding: 10px 10px 10px 0;
        background-color: transparent;
      `};

    ${({ readOnly }) =>
      readOnly &&
      css`
        cursor: default;
      `};

    border: none;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: ${({ resume }) => (resume ? '18px' : '12px')};
  }
`;

export default {
  Wrapper,
  InputTitle
};
