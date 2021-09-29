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

const Item = styled.li`
  background-color: #98989E;
  color: rgb(244,244,250);
  padding: 8px 24px;
  margin-bottom: 3px;
  border-radius: 2px;
  list-style: none;
`;

const Loading = styled.span`
  text-align: center;
  margin: 8px 0;
  display: block;
  color: whitesmoke;
`;

export default {
  Item,
  Loading,
};