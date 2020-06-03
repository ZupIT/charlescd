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
import { ReactComponent as SortSVG } from 'core/assets/svg/sort-left.svg';
import { slideInLeft, fadeIn } from 'core/assets/style/animate';
import InputTitleComponent from 'core/components/Form/InputTitle';
import Dropdown from 'core/components/Dropdown';

const Wrapper = styled.div`
  animation: 0.2s ${slideInLeft} linear;
`;

const Actions = styled.div`
  margin-left: auto;
  display: flex;
  flex-direction: row;

  > :last-child {
    margin-left: 36px;
  }
`;

const Action = styled(Dropdown.Item)``;

const Release = styled.div`
  position: relative;
  height: 61px;
  z-index: ${({ theme }) => theme.zIndex.OVER_2};

  > {
    position: absolute;
  }
`;

const Layer = styled.div`
  margin-top: 40px;

  :last-child {
    padding-bottom: 85px;
  }
`;

const Content = styled.div`
  animation: 0.5s ${fadeIn} linear;
  margin-top: 15px;
  margin-left: 45px;
`;

const Link = styled.a`
  text-decoration: none;
`;

const MetricsControl = styled.div`
  display: flex;
  justify-content: space-between;
  align-content: right;
  font-size: 12px;
`;

const MetricsLabel = styled.div`
  margin-right: 10px;
`;

const SortLeft = styled(SortSVG)`
  cursor: pointer;
  margin-right: 10px;
  transform: rotate(90deg);
`;

const SortRight = styled(SortSVG)`
  cursor: pointer;
  transform: rotate(-90deg);
`;

const MetricsTitle = styled.div`
  display: flex;
  justify-content: space-between;
`;

const InputTitle = styled(InputTitleComponent)`
  width: 334px;
  height: 31px;
  margin-top: 1px;
`;

export default {
  Link,
  Actions,
  Action,
  Content,
  Layer,
  Release,
  Wrapper,
  MetricsControl,
  MetricsLabel,
  SortLeft,
  SortRight,
  MetricsTitle,
  InputTitle
};
