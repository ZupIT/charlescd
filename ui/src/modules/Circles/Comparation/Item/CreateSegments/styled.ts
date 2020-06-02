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
import Button from 'core/components/Button';
import { HEADINGS_FONT_SIZE } from 'core/components/Text/enums';
import ButtonIconRoundedComponent from 'core/components/Button/Rounded';
import { Input as InputComponent } from 'core/components/Form';
import TextComponent from 'core/components/Text';
import LayerComponent from 'core/components/Layer';

interface ButtonIconProps {
  isActive: boolean;
}

interface ButtonDefaultProps {
  isValid: boolean;
}

const HelpText = styled(TextComponent.h5)`
  margin-top: 20px;
  margin-bottom: 10px;
`;

const Actions = styled.div`
  display: flex;

  button:first-child {
    margin-right: 15px;
  }
`;

const ButtonIconRounded = styled(ButtonIconRoundedComponent)`
  height: 40px;
  padding: 13px 25px;

  span {
    font-weight: normal;
    font-size: ${HEADINGS_FONT_SIZE.h6};
  }

  ${({ isActive }: ButtonIconProps) =>
    isActive &&
    css`
      background-color: ${({ theme }) => theme.radio.checked.background};
      span {
        color: ${({ theme }) => theme.radio.checked.color};
      }
      i {
        color: ${({ theme }) => theme.radio.checked.color};
      }
    `};
`;

const Input = styled(InputComponent)`
  width: 180px;
`;

const ButtonDefault = styled(Button.Default)<ButtonDefaultProps>`
  background-color: ${({ theme, isValid }) => {
    const { saveButton } = theme.circleSegmentation.importCSV;
    return isValid
      ? saveButton.valid.background
      : saveButton.invalid.background;
  }};
`;

const Content = styled.div`
  margin-top: 40px;
`;

const InputWrapper = styled.div`
  margin: 30px 0 40px;
`;

const Layer = styled(LayerComponent)`
  margin-left: 40px;
`;

export default {
  HelpText,
  Layer,
  Actions,
  Input,
  ButtonDefault,
  Content,
  InputWrapper,
  ButtonIconRounded
};
