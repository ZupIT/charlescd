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

const Expand = styled.div`
  max-height: 145px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  > a:nth-child(odd) {
    background: rgba(0, 0, 0, 0.1);
  }
`;

const Action = styled.button`
  border: none;
  background: ${({ theme }) => theme.card.expand.button};
  height: 4px;
  width: 40px;
  border-radius: 5px;
  margin: 9px auto -1px;
`;

export default {
  Action,
  Expand
};
