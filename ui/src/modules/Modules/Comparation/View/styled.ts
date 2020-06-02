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
import Card from 'core/components/Card';
import Button from 'core/components/Button';
import Form from 'core/components/Form';
import ContentIcon from 'core/components/ContentIcon';

const Layer = styled.div`
  margin: 40px 0;
`;

const ComponentCard = styled(Card.Config)`
  margin-top: 10px;
  margin-bottom: 10px;
`;

const ComponentWrapper = styled.div`
  display: flex;
`;

const ComponentIfon = styled.div`
  display: flex;
  width: 120px;
  align-items: center;
  margin-top: 15px;

  > :first-child {
    margin-right: 5px;
  }
`;

const ButtonRounded = styled(Button.Rounded)`
  margin: 10px 0px;
`;

const InputContentIcon = styled(ContentIcon)`
  > i {
    margin-top: 15px;
  }
`;

const FormLink = styled(Form.Link)`
  width: 393px;
`;

interface StepProp {
  isDisabled: boolean;
}
const Step = styled('div')<StepProp>`
  display: ${({ isDisabled }) => (isDisabled ? 'none' : 'block')};
`;

export default {
  Layer,
  ButtonRounded,
  InputContentIcon,
  FormLink,
  Component: {
    Card: ComponentCard,
    Wrapper: ComponentWrapper,
    Info: ComponentIfon
  },
  Step
};
