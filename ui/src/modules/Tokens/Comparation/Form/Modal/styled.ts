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
    min-height: 150px;
    width: 543px;
  }

  .modal-content {
    overflow: unset;

    > :first-child {
      margin-bottom: 24px;
    }

    > :not(:first-child) {
      margin-bottom: 10px;
    }
  }

  strong {
    color: ${({ theme }) => theme.text.light};
  }
`;

const Warning = styled.div`
  display: flex;
  align-items: center;

  >:first-child {
    margin-right: 10px;
  }
`;

export default {
  Modal,
  Warning
};
