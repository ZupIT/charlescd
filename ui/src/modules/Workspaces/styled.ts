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
import Form from 'core/components/Form';
import Text from 'core/components/Text';
import ButtonComponent from 'core/components/Button';

const Empty = styled.div`
  margin: 48px 30px 18px 30px;
`;

const Wrapper = styled.div`
  display: block;
  margin-top: 148px;
  margin-left: auto;
  margin-right: auto;
  width: 10%;
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
  Empty,
  Wrapper,
  Modal: {
    Input: ModalInput,
    Title: ModalTitle,
    Button: ButtonModal
  }
};
