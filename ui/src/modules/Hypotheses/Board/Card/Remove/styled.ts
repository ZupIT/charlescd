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
import ModalTrigger from 'core/components/Modal/Trigger';
import { COLOR_BLACK_RUSSIAN, COLOR_BASTILLE } from 'core/assets/colors';

const Modal = styled(ModalTrigger)`
  .modal-content {
    padding: 10px 48px;
    width: 408px;
    height: 330px;
    background-color: ${COLOR_BLACK_RUSSIAN};
    top: 50px;
  }

  .modal-background {
    opacity: 0.7;
    background-color: ${COLOR_BASTILLE};
  }

  .modal-buttons {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .modal-button-dismiss,
  .modal-button-continue {
    width: 100px;
  }
`;

export default {
  Modal
};
