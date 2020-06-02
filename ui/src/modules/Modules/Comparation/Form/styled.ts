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
import FormComponent from 'core/components/Form';
import PopoverComponent from 'core/components/Popover';
import ButtonComponent from 'core/components/Button';
import IconComponent from 'core/components/Icon';
import Text from 'core/components/Text';

const Title = styled(Text.h2)`
  display: flex;
  align-items: center;

  > :last-child {
    margin-left: 10px;
  }
`;

const Subtitle = styled(Text.h5)`
  margin: 20px 0;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  margin-left: 8px;
`;

const Form = styled.form``;

const Input = styled(FormComponent.Input)`
  width: 271px;
  margin-bottom: 12px;
`;

const Number = styled(FormComponent.Number)`
  width: 271px;
  margin-bottom: 12px;
`;

const FieldPopover = styled.div`
  position: relative;
  width: 271px;
`;

const Popover = styled(PopoverComponent)`
  position: absolute;
  bottom: 1px;
  right: -25px;
`;

const Button = styled(ButtonComponent.Default)`
  margin-top: 20px;
`;

const Icon = styled(IconComponent)`
  margin-bottom: 30px;
`;

const ComponentsWrapper = styled.div`
  display: flex;
  position: relative;
  margin-bottom: 20px;
`;

const ComponentInput = styled(FormComponent.Input)`
  width: 155px;
  margin-right: 20px;
`;

const ComponentNumber = styled(FormComponent.Number)`
  width: 155px;
  margin-right: 20px;
`;

const ComponentTrash = styled(IconComponent)`
  position: absolute;
  bottom: 5px;
  left: -20px;
`;

const ComponentButton = styled(ButtonComponent.Default)`
  display: flex;
  align-items: center;
  border: 2px solid ${({ theme }) => theme.button.default.outline.border};
  color: ${({ theme }) => theme.button.default.outline.color};
  box-sizing: content-box;
  background: none;
  margin-bottom: 40px;

  > i {
    margin-right: 5px;
  }
`;

export default {
  Content,
  Title,
  Subtitle,
  Form,
  Input,
  Number,
  FieldPopover,
  Popover,
  Icon,
  Button,
  Components: {
    Wrapper: ComponentsWrapper,
    Input: ComponentInput,
    Number: ComponentNumber,
    Button: ComponentButton,
    Trash: ComponentTrash
  }
};
