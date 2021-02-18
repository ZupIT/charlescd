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
import ButtonComponent from 'core/components/Button';
import { COLOR_BLACK_MARLIN } from 'core/assets/colors';
import Text from 'core/components/Text';

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
  height: calc(-200px + 100vh);
  overflow-y: auto;
`;

const ListItem = styled(LabeledIcon)`
  padding: 15px 0px;
  cursor: pointer;
  display: flex;
`;

const Item = styled(Text.h4)`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 230px;
`;
interface LinkProps {
  isActive: boolean;
}

const Link = styled('button')<LinkProps>`
  width: 100%;
  display: block;
  padding: 0 16px;
  background: none;
  border: none;
  text-decoration: none;
  background-color: ${({ isActive }) =>
    isActive ? COLOR_BLACK_MARLIN : 'transparent'};
`;

const A = styled.a`
  text-decoration: none;
`;

const Button = styled(ButtonComponent.Default)`
  border: none;
  background-color: transparent;
  padding: 0;
  margin: 0;
  height: auto;
`;

export default {
  A,
  Actions,
  Button,
  Content,
  Icon,
  Link,
  ListItem,
  Item,
  SearchInput
};
