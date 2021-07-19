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

const Modal = styled(ComponentModal.Default)`
  .modal-container {
    width: 543px;
    padding: 35px 0 28px 0;
    max-height: 650px;
    bottom: 100px;
  }

  .modal-content {
    overflow-y: hidden;
    max-height: 600px;
  }
`;

const Header = styled.div`
  padding: 0 40px;

  > :last-child {
    margin-top: 20px;
  }
`;

const Content = styled.div`
  margin-top: 22px;
  max-height: 500px;
  overflow-y: auto;
`;

export default {
  Content,
  Modal,
  Header,
};