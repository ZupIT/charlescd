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
import { Input } from 'core/components/Form';

const Search = styled(Input)`
  margin-top: 5px;
  margin-bottom: 20px;
  margin: 5px 40px 10px;

  > input {
    background-color: transparent;
    border-bottom: 1px solid ${({ theme }) => theme.token.workspace.search.input};
  }
`;

const Item = styled.div`
  border-top: 1px solid ${({ theme }) => theme.token.workspace.item.border};
  height: 50px;
`;

const Content = styled.div`
  margin-top: 22px;
  max-height: 300px;
  overflow-y: auto;
`;

const NoContent = styled.div`
  height: 100px;
  display: flex;
  margin-top: 24px;
  justify-content: center;
`;

const Empty = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 10px 40px 18px;
`;

export default {
  Search,
  Item,
  Content,
  NoContent,
  Empty,
}