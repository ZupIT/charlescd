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
import ComponentText from 'core/components/Text';

const Header = styled.div`
  height: 41px;
  background-color: ${({ theme }) => theme.tabPanel.header.background};
  padding-right: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Panel = styled.div`
  width: 660px;
  box-sizing: border-box;
  border-right: 1px solid ${({ theme }) => theme.tabPanel.border};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 10px;
  padding-right: 32px;
  padding-left: 32px;
  overflow: auto;
  height: calc(100vh - 90px);
`;

const Actions = styled.div`
  margin-right: auto;
  display: flex;
  flex-direction: row;
`;

const Title = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  > * + * {
    margin-left: 8px;
  }
`;

const Text = styled(ComponentText.h5)`
  width: 150px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Tab = styled.div`
  color: ${({ theme }) => theme.tabPanel.color};
  display: flex;
  align-items: center;
  flex-direction: row;
  width: 233px;
  height: 41px;
  box-sizing: border-box;
  padding-left: 31px;
  background-color: ${({ theme }) => theme.tabPanel.background};

  > * + * {
    margin-left: auto;
    margin-right: 12px;
  }
`;

export default {
  Content,
  Text,
  Header,
  Panel,
  Tab,
  Title,
  Actions
};
