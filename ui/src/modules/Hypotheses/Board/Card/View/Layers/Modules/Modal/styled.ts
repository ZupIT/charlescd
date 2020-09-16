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
import ComponentModal from 'core/components/Modal';
import ComponentIcon from 'core/components/Icon';
import ComponentInput from 'core/components/Form/Input';
import PanelComponent from 'core/components/Panel';

const Modal = styled(ComponentModal.Default)`
  .modal-container {
    padding-top: 30px !important;
    padding-bottom: 30px !important;
    width: 500px !important;
  }
`;

const Module = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 320px;
  padding: 10px 0;

  :not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.board.module.border};
  }
`;

const Header = styled.div``;

const Search = styled(ComponentInput)`
  margin-top: 5px;
  margin-bottom: 20px;

  > input {
    background-color: transparent;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
`;

const Description = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5px 20px;
  width: 300px;
`;

const Loading = styled(ComponentIcon)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Panel = styled(PanelComponent.Content)`
  i {
    border-top: none;
  }
`;

export default {
  Modal,
  Description,
  Module,
  Header,
  Search,
  Loading,
  Content,
  Panel
};
