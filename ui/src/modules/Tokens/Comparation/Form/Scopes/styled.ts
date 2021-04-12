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
import ButtonComponent from 'core/components/Button';

const Button = styled(ButtonComponent.Rounded)`
  margin-top: 10px;
`;

interface ContentProps {
  left?: boolean;
  displayAction?: boolean;
}

const Content = styled.div<ContentProps>`
  margin-top: 10px;
  display: ${({ displayAction = true }) => displayAction ? 'block' : 'none' };

  > * {
    margin-bottom: 10px;
  }

  ${({ left }) => left && css`
    margin-left: 35px;
  `}
`;

const Description = styled.div`
  width: 550px;
  margin-bottom: 32px;
`;

const View = styled.div``;

const ViewHead = styled.div`
  display: flex;
  margin-bottom: 10px;

  * {
    flex-grow: 1;
    flex-basis: 50%;
  }
  
  >:first-child {
    padding-left: 10px;
  }
`;

const ViewItem = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.token.scope.view.background};
  padding-left: 10px;
  margin-bottom: 10px;

  * {
    flex-grow: 1;
    flex-basis: 50%;
  }
`;

const ViewScope = styled.div`
  display: flex;
  align-items: center;

  >:first-child{
    flex-grow: 0;
    flex-basis: auto;
    padding-right: 10px;
  }
`;

export default {
  Button,
  Content,
  Description,
  View,
  ViewHead,
  ViewItem,
  ViewScope
}