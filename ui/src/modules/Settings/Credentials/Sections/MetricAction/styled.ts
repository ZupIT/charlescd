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
import ComponentInput from 'core/components/Form/Input';
import SelectComponent from 'core/components/Form/Select';
import Text from 'core/components/Text';
import ButtonIconRoundedComponent from 'core/components/Button/Rounded';
import { HEADINGS_FONT_SIZE } from 'core/components/Text/enums';
import { fadeIn } from 'core/assets/style/animate';
import ComponentText from 'core/components/Text';
import TextComponent from 'core/components/Text';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  animation: 0.3s ${fadeIn} linear;
  margin-top: 10px;
  margin-left: 40px;

  > :first-child {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    > :last-child {
      margin-left: 10px;
    }
  }
`;

const Form = styled.form`
  width: 269px;

  > :first-child {
    margin-bottom: 20px;
  }
`;

const Input = styled(ComponentInput)`
  margin-bottom: 20px;
`;

const Select = styled(SelectComponent.Single)`
  margin-bottom: 20px;
  width: 271px;
`;

const OptionText = styled(Text.h5)`
  padding: 15px 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  padding-bottom: 15px;

  button {
    padding-right: 20px;
  }
`;

interface ButtonIconProps {
  isActive: boolean;
}

const ButtonIconRounded = styled(ButtonIconRoundedComponent)`
  height: 40px;
  padding: 15px 35px;
  margin-right: 25px;

  span {
    font-weight: normal;
    font-size: ${HEADINGS_FONT_SIZE.h6};
    margin-right: 10px;
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

type FormContertProps = {
  showForm: boolean;
};

const FormContent = styled.div<FormContertProps>`
  display: ${({ showForm }) => (showForm ? 'block' : 'none')};
`;

const Title = styled(ComponentText.h2)`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  > :last-child {
    margin-left: 10px;
  }
`;

const Info = styled(ComponentText.h5)`
  margin-bottom: 20px;
`;

const Link = styled.a`
  text-decoration: underline;
  color: ${({ theme }) => theme.popover.link.color};
  text-decoration-color: ${({ theme }) => theme.popover.link.color};
  :hover {
    text-decoration: underline;
    text-decoration-color: ${({ theme }) => theme.popover.link.color};
  }
`;

const Placeholder = styled(TextComponent.h4)`
  pointer-events: none;
  margin-left: 47px;
  opacity: 60%;
  overflow: hidden;
  position: absolute;
  top: 21px
`;

const Wrapper = styled.div`
  position: relative;
`;

export default {
  Form,
  Content,
  Input,
  Select,
  OptionText,
  ButtonGroup,
  FormContent,
  ButtonIconRounded,
  Title,
  Info,
  Link,
  Placeholder,
  Wrapper
};
