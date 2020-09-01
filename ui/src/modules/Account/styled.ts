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
import Page from 'core/components/Page';
import ComponentLayer from 'core/components/Layer';
import ComponentContentIcon from 'core/components/ContentIcon';
import Text from 'core/components/Text';
import FormComponent from 'core/components/Form';
import { slideInLeft, fadeIn } from 'core/assets/style/animate';
import CheckPass from 'core/components/CheckPassword';

const Wrapper = styled.div`
  animation: 0.2s ${slideInLeft} linear;
`;

const Scrollable = styled(Page.Content)`
  overflow: auto;
`;

const Content = styled.div`
  margin-top: 15px;
  margin-left: 45px;
`;

const ContentIcon = styled(ComponentContentIcon)`
  align-items: center;
`;

const Layer = styled(ComponentLayer)`
  span + span {
    margin-top: 10px;
  }
`;

const Form = styled.div`
  animation: 0.5s ${fadeIn} linear;
  margin-top: 51px;
  margin-left: 30px;

  :last-child {
    padding-bottom: 40px;
  }
`;

const Actions = styled.div`
  margin-left: auto;
  display: flex;
  flex-direction: row;

  > :last-child {
    margin-left: 36px;
  }
`;

const ChangePassword = styled.form`
  width: 320px;
`;

const ModalSubtitle = styled(Text.h5)`
  margin: 20px 0 10px;
`;

const ModalInfo = styled(Text.h5)`
  margin: 20px 0 10px;
  line-height: 14px;
`;

const Password = styled(FormComponent.Password)`
  margin-top: 20px;
  input {
    background-color: transparent;
  }
`;

const Error = styled(Text.h6)`
  margin-top: 5px;
`;

const CheckPassword = styled(CheckPass)`
  margin: 20px 0;
`;

export default {
  Wrapper,
  Content,
  ContentIcon,
  Layer,
  Scrollable,
  Form,
  Actions,
  ChangePassword,
  Password,
  Modal: {
    Subtitle: ModalSubtitle,
    Info: ModalInfo
  },
  Error,
  CheckPassword
};
