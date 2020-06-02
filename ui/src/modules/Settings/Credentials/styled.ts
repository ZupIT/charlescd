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

const Wrapper = styled.div`
  animation: 0.2s ${slideInLeft} linear;
`;

const Content = styled.div`
  margin-top: 15px;
  margin-left: 45px;

  > :not(:first-child) {
    margin-top: 10px;
  }
`;

const Actions = styled.div`
  margin-left: auto;
  display: flex;
  flex-direction: row;

  > :last-child {
    margin-left: 36px;
  }
`;

const Layer = styled.div`
  animation: 0.5s ${fadeIn} linear;
  margin-top: 40px;

  :last-child {
    padding-bottom: 235px;
  }
`;

const Form = styled.div`
  animation: 0.5s ${fadeIn} linear;
  margin-top: 51px;
  margin-left: 30px;

  :last-child {
    padding-bottom: 40px;
  }
`;

export default {
  Actions,
  Wrapper,
  Content,
  Layer,
  Form
};
