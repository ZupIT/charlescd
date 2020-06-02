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
import Form from 'core/components/Form';
import Text from 'core/components/Text';

const SearchInput = styled(SearchInputComponent)`
  margin: 15px 0;
  padding: 0 16px;
`;

const List = styled.ul`
  padding: 0 16px;
  margin: 0;
  list-style-type: none;
`;

const ListItem = styled(LabeledIcon)`
  padding: 15px 0;
  cursor: pointer;
  display: flex;
`;

const Content = styled.div`
  height: calc(100vh - 200px);
  overflow-y: auto;
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

const Link = styled.button`
  display: block;
  padding: 0px;
  margin: 0px;
  background: none;
  border: none;
  text-decoration: none;
`;

const Button = styled(ButtonComponent.Default)`
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

const ModalTitle = styled(Text.h2)`
  margin-bottom: 20px;
`;

const Item = styled(Text.h4)`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 230px;
`;

const ButtonModal = styled(ButtonComponent.Default)`
  width: 155px;
  padding-left: 0;
  padding-right: 0;
  margin-top: 20px;
`;

export default {
  Item,
  SearchInput,
  List,
  ListItem,
  Content,
  Actions,
  Icon,
  Link,
  Button,
  Modal: {
    Input: ModalInput,
    Title: ModalTitle,
    Button: ButtonModal
  }
};
