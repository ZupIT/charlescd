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
import { slideInLeft, fadeIn } from 'core/assets/style/animate';
import ButtonComponent from 'core/components/Button';
import IconComponent from 'core/components/Icon';
import { HEADINGS_FONT_SIZE } from 'core/components/Text/enums';
import { Input } from 'core/components/Form';
import ContentIconComponent from 'core/components/ContentIcon';

const Wrapper = styled.div`
  animation: 0.2s ${slideInLeft} linear;
`;

const Content = styled.div`
  animation: 0.5s ${fadeIn} linear;
  margin-top: 15px;
  margin-left: 45px;
`;

const Layer = styled.div`
  margin-top: 40px;

  :last-child {
    padding-bottom: 85px;
  }
`;

const EditorWrapper = styled.div`
  margin-bottom: 20px;
`;

const InputWrapper = styled.div`
  display: flex;
  width: 470px;
  justify-content: space-between;
  margin: 10px 0;
  position: relative;
`;

const InputText = styled(Input)`
  width: 220px;
`;

const Button = styled(ButtonComponent.Default)`
  display: flex;
  align-items: center;
  border: 2px solid ${({ theme }) => theme.button.default.outline.border};
  color: ${({ theme }) => theme.button.default.outline.color};
  box-sizing: content-box;
  background: none;
  margin: 20px 0 40px 0;

  > i {
    margin-right: 5px;
  }
`;

const TrashIcon = styled(IconComponent)`
  position: absolute;
  bottom: 5px;
  left: -20px;
`;

const CardWrapper = styled.div`
  background-color: ${({ theme }) => theme.circleMatcher.circleCard.background};
  display: flex;
  height: 60px;
  padding: 5.5px 0 4.5px 3.25px;
  width: 520px;
  margin: 15px 0;
`;

const CardContent = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: space-between;
  padding: 0 10px;
`;

const CardLeftLine = styled.div`
  height: 100%;
  width: 1px;
  background: ${({ theme }) => theme.circleMatcher.leftLine.background};
`;

const ButtonOutlineRounded = styled(ButtonComponent.Rounded)`
  border: 1px solid ${({ theme }) => theme.button.default.outline.border};
  color: ${({ theme }) => theme.button.default.outline.color};
  padding: 9.5px 18.5px;
  width: 62px;
  height: 30px;
  text-align: center;
  justify-content: center;

  span {
    font-size: ${HEADINGS_FONT_SIZE.h6};
  }
`;

const ContentIcon = styled(ContentIconComponent)`
  align-items: center;
`;

export default {
  Wrapper,
  Content,
  Layer,
  InputWrapper,
  EditorWrapper,
  Button,
  TrashIcon,
  CardWrapper,
  CardContent,
  CardLeftLine,
  ButtonOutlineRounded,
  InputText,
  ContentIcon
};
