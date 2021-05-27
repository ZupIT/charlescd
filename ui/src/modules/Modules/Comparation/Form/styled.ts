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

import styled, { css } from 'styled-components';
import FormComponent from 'core/components/Form';
import ComponentPopover, {
  Props as PopoverProps
} from 'core/components/Popover';
import ButtonComponentDefault from 'core/components/Button/ButtonDefault';
import IconComponent from 'core/components/Icon';
import Text, { Props as TextProps } from 'core/components/Text';
import { slideInRight } from 'core/assets/style/animate';

const Title = styled(Text.h2)`
  display: flex;
  align-items: center;

  > :last-child {
    margin-left: 10px;
  }
`;

interface StyledSubtitle extends TextProps {
  isEditing?: boolean;
}

const Subtitle = styled(Text.h5)<StyledSubtitle>`
  margin: 20px 0px 5px;

  ${({ isEditing }) => isEditing && css`
    margin-bottom: 25px;
  `};
`;

const Options = styled(Text.h5)`
  margin: 16px 0px;
`;

const MinorTitle = styled(Text.h3)`
  margin: 10px 0px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  margin-left: 8px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Number = styled(FormComponent.Number)`
  width: 271px;
  margin-bottom: 12px;
`;

const Input = styled(FormComponent.Input)`
  width: 271px;
  margin-bottom: 5px;
`;

const Helm = styled.div`
  margin-top: 40px;
  margin-bottom: 12px;
  width: 271px;
`;

const Fields = styled.div`
  margin-bottom: 12px;
  width: 271px;
`;

const FieldPopover = styled.div`
  position: relative;
  width: 271px;
`;

const Popover = styled(ComponentPopover)<PopoverProps>`
  position: absolute;
  bottom: 1px;
  right: -25px;
`;

const Button = styled(ButtonComponentDefault)`
  margin-top: 20px;
`;

const Icon = styled(IconComponent)`
  width: 50px;
  animation: ${slideInRight} 1s forwards;
  margin-bottom: 30px;
`;

const ComponentsColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ComponentsWrapper = styled.div`
  display: flex;
  position: relative;
  margin-bottom: 0px;
  flex-direction: row;
`;

const ComponentInput = styled(FormComponent.Input)`
  width: 165px;
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

const ComponentButton = styled(ButtonComponentDefault)`
  display: flex;
  align-items: center;
  border: 2px solid ${({ theme }) => theme.button.default.outline.border};
  color: ${({ theme }) => theme.button.default.outline.color};
  box-sizing: content-box;
  background: none;
  margin-top: 10px;
  margin-bottom: 40px;

  > i {
    margin-right: 5px;
  }
`;

const MoreOptionsButton = styled(ButtonComponentDefault)`
  display: flex;
  align-items: center;
  border: 2px solid ${({ theme }) => theme.button.default.outline.border};
  color: ${({ theme }) => theme.button.default.outline.color};
  box-sizing: content-box;
  background: none;
  margin-bottom: 20px;

  > i {
    margin-right: 5px;
  }
`;

const AdvancedOptions = styled.div``;

export default {
  Content,
  Title,
  MinorTitle,
  Subtitle,
  Form,
  Input,
  Number,
  FieldPopover,
  Helm,
  Fields,
  Popover,
  Icon,
  Button,
  Options,
  Components: {
    Wrapper: ComponentsWrapper,
    ColumnWrapper: ComponentsColumnWrapper,
    Input: ComponentInput,
    Number: ComponentNumber,
    Button: ComponentButton,
    MoreOptionsButton: MoreOptionsButton,
    Trash: ComponentTrash,
    AdvancedOptions
  }
};
