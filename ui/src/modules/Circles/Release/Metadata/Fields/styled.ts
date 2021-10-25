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

const Field = styled.div<{ hasErrors: boolean }>`
  width: 490px;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin-bottom: 10px;

  > * {
    margin-right: 10px;
  }

  > :not(:first-child) {
    width: 150px;
  }

  ${({ hasErrors }) => hasErrors && css`
    display: flex;
    align-items: start;
    height: 100px;

    > i {
      margin-top: 27px;
    }
  `}
`;

export default {
  Field
};
