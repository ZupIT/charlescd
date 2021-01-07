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
import PopoverComponent, {
  Props as PopoverProps
} from 'core/components/Popover';
import Text from 'core/components/Text';
import NumberInput from 'core/components/Form/Number';

interface ButtonIconProps {
  isActive: boolean;
}

interface ButtonDefaultProps {
  isValid: boolean;
}

interface SliderValueProps {
  valueIsValid: boolean;
}

const HelpText = styled(TextComponent.h5)`
  margin-top: 20px;
  margin-bottom: 10px;
`;

const Actions = styled.div`
  display: flex;
`;

const ButtonIconRounded = styled(ButtonIconRoundedComponent)`
  height: 40px;
  padding: 13px 25px;
  margin-right: 15px;

  span {
    font-weight: bold;
    font-size: ${HEADINGS_FONT_SIZE.h6};
  }

  ${({ isActive }: ButtonIconProps) =>
    isActive &&
    css`
      background-color: ${({ theme }) => theme.radio.button.checked.background};
      span {
        color: ${({ theme }) => theme.radio.button.checked.color};
      }
      i {
        color: ${({ theme }) => theme.radio.button.checked.color};
      }
    `};
`;

const Input = styled(InputComponent)`
  width: 180px;
`;

const ButtonDefault = styled(Button.Default)<ButtonDefaultProps>`
  height: 30px;
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

const FieldPopover = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const Popover = styled(PopoverComponent)<PopoverProps>`
  margin-left: 10px;
`;

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const SliderInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 20px;
  width: 80%;
`;

const Slider = styled.input`
  height: 2px;
  width: 70%;
  -webkit-appearance: none;
  background: ${({ theme }) => theme.slider.backgroundColor};
  outline: none;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;

  ::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    border-radius: 50%;
    width: 15px;
    height: 15px;
    background: ${({ theme }) => theme.slider.thumbColor};
    cursor: pointer;
  }
`;

const SliderValue = styled(Text.h4)<SliderValueProps>`
  border-bottom: ${({ theme }) => `1px solid ${theme.slider.valueBorderColor}`};
  padding-bottom: 3px;
  width: 40px;
  text-align: center;
  color: ${({ valueIsValid, theme }) =>
    valueIsValid
      ? theme.slider.valueColor.active
      : theme.slider.valueColor.inactive};
`;

const SliderNumberInput = styled(NumberInput)`
  width: 50px;
  display: flex;
  align-items: center;

  > input {
    position: relative;
  }
`;

export default {
  HelpText,
  Layer,
  Actions,
  Input,
  ButtonDefault,
  Content,
  InputWrapper,
  ButtonIconRounded,
  FieldPopover,
  Popover,
  Slider,
  SliderContainer,
  SliderInputContainer,
  SliderValue,
  SliderNumberInput
};
