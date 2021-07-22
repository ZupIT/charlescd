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
import ButtonComponentDefault from 'core/components/Button/ButtonDefault';
import Form from 'core/components/Form';
import Text from 'core/components/Text';
import { COLOR_BLACK_MARLIN } from 'core/assets/colors';
import LoaderMenuComponent from './Loaders';

const SearchInput = styled(SearchInputComponent)`
  margin: 15px 0;
  padding: 0 16px;
`;

const ListItem = styled(LabeledIcon)`
  padding: 15px 0;
  cursor: pointer;
  display: flex;
`;

const Item = styled(Text)`
  text-overflow: ellipsis;
  overflow: hidden;
  width: 240px;
`

const Content = styled.div`
  height: calc(100vh - 250px);
`;

const Actions = styled.div`
  > * + * {
    margin-left: 20px;
  }
  padding: 0 16px;
`;

const Icon = styled(IconComponent)`
  cursor: pointer;
`;

interface LinkProps {
  isActive: boolean;
}

const Link = styled('button')<LinkProps>`
  background: none;
  border: none;
  text-decoration: none;
  width: 100%;
  padding: 0 16px;
  background-color: ${({ isActive }) =>
    isActive ? COLOR_BLACK_MARLIN : 'transparent'};
`;

const Button = styled(ButtonComponentDefault)`
  border: none;
  background-color: transparent;
  padding: 0;
  margin: 0;
  height: auto;
`;

const ModalInput = styled(Form.Input)`
  width: 315px;

  > input {
    background-color: ${({ theme }) => theme.modal.default.background};
  }
`;

const ModalTitle = styled(Text)`
  margin-bottom: 20px;
`;

const ButtonModal = styled(ButtonComponentDefault)`
  width: 90px;
  height: 40px;
  margin-top: 20px;
`;

const Loader = styled(LoaderMenuComponent.List)`
  padding: 0 16px;
`;

const Empty = styled.div`
  padding: 0 16px;
`;

export default {
  SearchInput,
  ListItem,
  Item,
  Content,
  Actions,
  Icon,
  Link,
  Button,
  Loader,
  Empty,
  Modal: {
    Input: ModalInput,
    Title: ModalTitle,
    Button: ButtonModal
  }
};
