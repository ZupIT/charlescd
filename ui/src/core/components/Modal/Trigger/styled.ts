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
import DefaultButton from 'core/components/Button/ButtonDefault';
import LabeledIcon from 'core/components/LabeledIcon';

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
  top: 25%;
  left: calc(50% - 204px);
  padding: 11px 41px 28px 40px;
  text-align: left;
  background: ${({ theme }) => theme.modal.trigger.background};
  width: 408px;
  min-height: 210px;
  box-sizing: border-box;
  border-radius: 6px;
  opacity: 1.2;
`;

const Title = styled(Text)`
  text-align: left;
  margin-bottom: 0;
`;

const Description = styled.div`
  margin: 16px 0 24px 0;

  span {
    line-height: 1.3;
  }
`;

const ContinueButton = styled(DefaultButton)`
  padding: 5px;
  margin-top: 0;
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
  margin-top: 0;
  align-items: center;
  height: 40px;
  width: 160px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  border: 0.1rem solid ${({ theme }) => theme.modal.trigger.border};
  background-color: transparent;

  span {
    color: ${({ theme }) => theme.modal.trigger.border};
  }
`;

const CloseButtonContainer = styled.div`
  margin-left: 324px;
`;

const ItemName = styled(LabeledIcon)`
  padding: 16px 0 0 0;
`;

export default {
  ItemName,
  Buttons,
  Button: {
    Continue: ContinueButton,
    Dismiss: DismissButton,
    Container: CloseButtonContainer
  },
  Content,
  Background,
  Title,
  Description,
  Wrapper
};
