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
import TabPanel from 'core/components/TabPanel';

const Tab = styled(TabPanel)`
  width: 1560px;

  .tabpanel-content {
    padding-left: 0px;
  }
`;

const Board = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  overflow: hidden;

  > :first-child {
    margin-left: 40px;
  }

  > :not(:first-child) {
    margin-left: 20px;
  }
`;

export default {
  Board,
  Tab
};
