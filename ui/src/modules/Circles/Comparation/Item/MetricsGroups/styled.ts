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
import ComponentIcon from 'core/components/Icon';
import ButtonComponent from 'core/components/Button';
import ButtonIconRoundedComponent from 'core/components/Button/Rounded';
import SelectComponent from 'core/components/Form/Select';
import InputNumberComponent from 'core/components/Form/Number';
import Text from 'core/components/Text';
import InputComponent from 'core/components/Form/Input';
import { slideInRight } from 'core/assets/style/animate';
import LayerComponent from 'core/components/Layer';
import { HEADINGS_FONT_SIZE } from 'core/components/Text/enums';

interface ButtonDefaultProps {
  isValid: boolean;
}

interface ButtonIconProps {
  isActive: boolean;
}

const Icon = styled(ComponentIcon)`
  animation: ${slideInRight} 1s forwards;
  margin-bottom: 20px;
  margin-top: 22px;
`;

const TrashIcon = styled(ComponentIcon)`
  display: flex;
  margin-bottom: 6px;
  cursor: pointer;
`;

const Layer = styled(LayerComponent)`
  margin-top: 20px;
  margin-left: 40px;
`;

const ButtonAdd = styled(ButtonComponent.Rounded)`
  margin-top: 15px;
  margin-bottom: 15px;
`;

const Input = styled(InputComponent)`
  width: 230px;
  margin: 10px 0 20px;
`;

const ButtonDefault = styled(ButtonComponent.Default)<ButtonDefaultProps>`
  background-color: ${({ theme, isValid }) => {
    const { saveButton } = theme.circleSegmentation.importCSV;
    return isValid
      ? saveButton.valid.background
      : saveButton.invalid.background;
  }};
`;

const Form = styled.form`
  width: 540px;
`;

const Subtitle = styled(Text.h5)`
  margin: 20px 0;
`;

const Title = styled(Text.h2)`
  margin-top: 40px;
`;

const ThresholdSelect = styled(SelectComponent.Single)`
  width: 130px;
  margin-right: 20px;
`;

const InputNumber = styled(InputNumberComponent)`
  width: 130px;
`;

const ThresholdWrapper = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const Select = styled(SelectComponent.Single)`
  width: 230px;
  margin-bottom: 20px;
`;

const SelectMetric = styled(SelectComponent.Single)`
  width: 380px;
  margin-bottom: 20px;
`;

const Actions = styled.div`
  margin: 20px 0;
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

const AdvancedQueryWrapper = styled.div`
  width: 100%;
  margin: 20px 0;
`;

const ModalInput = styled(InputComponent)`
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

const RuleWrapper = styled.div`
  max-width: 80%;
`;

const FieldErrorWrapper = styled.div`
  display: flex;

  span {
    margin-left: 5px;
  }
`;

export default {
  Layer,
  Icon,
  ButtonAdd,
  Input,
  ButtonDefault,
  Form,
  Subtitle,
  Title,
  ThresholdSelect,
  InputNumber,
  ThresholdWrapper,
  Select,
  SelectMetric,
  Actions,
  ButtonIconRounded,
  AdvancedQueryWrapper,
  Modal: {
    Input: ModalInput,
    Title: ModalTitle,
    Button: ButtonModal
  },
  TrashIcon,
  RuleWrapper,
  FieldErrorWrapper
};
