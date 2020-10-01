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
import ModalDefault from 'core/components/Modal/Default';
import ComponentButton from 'core/components/Button';
import { COLOR_BLACK_RUSSIAN, COLOR_BASTILLE } from 'core/assets/colors';

const Members = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 10px;
`;

const Button = styled(ComponentButton.Rounded)`
  margin-top: 5px;
`;

const Modal = styled(ModalDefault)`
  .modal-container {
    padding: 10px 70px;
    width: 1111px;
    background-color: ${COLOR_BLACK_RUSSIAN};
    top: 50px;
  }

  .modal-background {
    opacity: 0.7;
    background-color: ${COLOR_BASTILLE};
  }
`;

export default {
  Button,
  Modal,
  Members
};
