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
import LabeledIcon from 'core/components/LabeledIcon';
import SearchInputComponent from 'core/components/Form/SearchInput';
import IconComponent from 'core/components/Icon';
import { COLOR_BLACK_MARLIN } from 'core/assets/colors';

const SearchInput = styled(SearchInputComponent)`
  margin: 15px 0;
  padding: 0 16px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;

  > * + * {
    margin-left: 20px;
  }
  padding: 0 16px;
`;

const Icon = styled(IconComponent)`
  cursor: pointer;
`;

const Content = styled.div`
  height: calc(100vh - 200px);
  overflow-y: auto;
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style-type: none;

  > * {
    padding: 0 16px;
  }
`;

const ListItem = styled(LabeledIcon)`
  padding: 15px 0px;
  cursor: pointer;
  display: flex;
`;

interface LinkProps {
  isActive: boolean;
}

const Link = styled('button')<LinkProps>`
  background: none;
  border: none;
  text-decoration: none;
  background-color: ${({ isActive }) =>
    isActive ? COLOR_BLACK_MARLIN : 'transparent'};
`;

const A = styled.a`
  text-decoration: none;
`;

export default {
  A,
  Actions,
  Content,
  Icon,
  Link,
  List,
  ListItem,
  SearchInput
};
