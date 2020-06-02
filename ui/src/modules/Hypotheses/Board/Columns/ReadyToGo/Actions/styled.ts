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
import ComponentButton from 'core/components/Button';

const ActionContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 269px;
  margin-top: -90px;

  > * {
    margin-bottom: 10px;
  }
`;

const ActionButton = styled(ComponentButton.Rounded)`
  position: relative;
  display: flex;
  justify-content: center;
  width: 269px;
  height: 40px;
  background: ${({ theme }) => theme.board.button.action.background};
  box-shadow: 0px 2px 10px 0px
    ${({ theme }) => theme.board.button.action.shadow};
  z-index: ${({ theme }) => theme.zIndex.OVER_2};
`;

const CancelContent = styled(ActionContent)`
  margin-top: -45px;
`;

const Button = styled(ComponentButton.Rounded)`
  height: 40px;
  width: 268px;
  display: flex;
  justify-content: center;
  background: ${({ theme }) => theme.board.button.background};
  z-index: ${({ theme }) => theme.zIndex.OVER_1};
`;

const Background = styled.div`
  background: ${({ theme }) => theme.modal.default.screen};
  width: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${({ theme }) => theme.zIndex.OVER_1};
  opacity: 0.8;
`;

export default {
  Action: {
    Content: ActionContent,
    Button: ActionButton
  },
  Cancel: {
    Content: CancelContent
  },
  Button,
  Background
};
