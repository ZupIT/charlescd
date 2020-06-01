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
import Page from 'core/components/Page';

const Wrapper = styled.div`
  display: block;
  margin-top: 148px;
  margin-left: auto;
  margin-right: auto;
  width: 10%;
`;

const Empty = styled.div`
  display: flex;
  margin-top: 162px;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const Scrollable = styled(Page.Content)`
  overflow: auto;
`;

const ScrollableX = styled(Page.Content)`
  overflow-y: hidden;
  overflow-x: auto;
`;

export default {
  Empty,
  Scrollable,
  ScrollableX,
  Wrapper
};
