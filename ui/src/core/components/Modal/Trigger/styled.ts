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
import Text from 'core/components/Text';
import DefaultButton from 'core/components/Button/Default';

const Wrapper = styled.div``;

const Buttons = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

const Background = styled.div`
  background: ${({ theme }) => theme.modal.trigger.screen};
  width: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${({ theme }) => theme.zIndex.OVER_3};
  opacity: 0.8;
`;

const Content = styled.div`
  position: fixed;
  display: flex-inline;
  flex-direction: column;
  z-index: ${({ theme }) => theme.zIndex.OVER_4};
  top: 245px;
  left: 650px;
  padding: 11px 41px 28px 40px;
  text-align: left;
  background: ${({ theme }) => theme.modal.trigger.background};
  width: 408px;
  height: 210px;
  box-sizing: border-box;
  border-radius: 6px;
  opacity: 1.2;
`;

const Title = styled(Text.h2)`
  text-align: left;
  margin-bottom: 20px;
`;

const ContinueButton = styled(DefaultButton)`
  cursor: pointer;
  padding: 5px;
  margin-top: 15px;
  margin-left: 15px;
  align-items: center;
  height: 40px;
  width: 160px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  background-color: ${({ theme }) => theme.modal.trigger.continue};
`;

const DismissButton = styled(DefaultButton)`
  cursor: pointer;
  padding: 5px;
  margin-top: 15px;
  align-items: center;
  height: 40px;
  width: 160px;
  box-sizing: border-box;
  border: ${({ theme }) => theme.modal.trigger.border} 0.5px solid;
  display: flex;
  justify-content: center;
  background-color: transparent;
`;

const CloseButtonContainer = styled.div`
  margin-left: 324px;
`;

export default {
  Buttons,
  Button: {
    Continue: ContinueButton,
    Dismiss: DismissButton,
    Container: CloseButtonContainer
  },
  Content,
  Background,
  Title,
  Wrapper
};
