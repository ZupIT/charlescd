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
import ButtonComponent from 'core/components/Button';
import SearchInputComponent from 'core/components/Form/SearchInput';
import LabeledIcon from 'core/components/LabeledIcon';
import Form from 'core/components/Form';
import Text from 'core/components/Text';
import { COLOR_BLACK_MARLIN } from 'core/assets/colors';

const SearchInput = styled(SearchInputComponent)`
  padding: 0 16px;
`;

const CreateHypotheses = styled(ButtonComponent.Default)`
  background: transparent;
  padding: 0 16px;

  :hover {
    transform: none;
  }
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
  background: none;
  border: none;
  text-decoration: none;
  background-color: ${({ isActive }) =>
    isActive ? COLOR_BLACK_MARLIN : 'transparent'};
`;

const ModalInput = styled(Form.Input)`
  width: 315px;

  > input {
    background-color: ${({ theme }) => theme.modal.default.background};
  }
`;

const ModalTitle = styled(Text.h2)`
  margin-bottom: 20px;
`;

const ButtonModal = styled(ButtonComponent.Default)`
  width: 155px;
  padding-left: 0;
  padding-right: 0;
  margin-top: 20px;
`;

export default {
  Content,
  List,
  ListItem,
  Item,
  Link,
  SearchInput,
  CreateHypotheses,
  Modal: {
    Input: ModalInput,
    Title: ModalTitle,
    Button: ButtonModal
  }
};
