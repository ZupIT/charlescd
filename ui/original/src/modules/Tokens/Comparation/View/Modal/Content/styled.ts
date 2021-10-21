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

const Wrapper = styled.div`
  height: 50px;
`;

const Item = styled.div`
  border-top: 1px solid ${({ theme }) => theme.token.workspace.item.border};
  border-bottom: 1px solid ${({ theme }) => theme.token.workspace.item.border};
  height: 70px;
  padding: 0 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  :last-child {
    border: hidden;
  }
`;

const Content = styled.div`
  margin-top: 16px;
  height: 500px;
  overflow-y: auto;
`;

const Description = styled.div``;

const Subtitle = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 5px;
`;

export default {
  Search,
  Wrapper,
  Item,
  Content,
  Description,
  Subtitle,
}