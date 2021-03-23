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
    width: 408px;
    padding: 35px 0 28px 0;
  }

  .modal-content {
    min-height: 450px;
  }
`;

const Header = styled.div`
  padding: 0 40px;
`;

const Content = styled.div`
  margin-top: 22px;
`;

const Item = styled.div`
  border-top: 1px solid #3A3A3C;
  border-bottom: 1px solid #3A3A3C;
  height: 90px;
  padding: 0 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Subtitle = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 5px;
`;

const Description = styled.div``;

export default {
  Content,
  Modal,
  Header,
  Item,
  Subtitle,
  Description
}