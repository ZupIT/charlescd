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
import IconComponent from 'core/components/Icon';
import Text from 'core/components/Text';
import { Props } from '.';

const Action = styled.div`
  padding: 5px 0;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const Wrapper = styled.div<Partial<Props>>`
  display: inline-block;
`;

const Content = styled.div``;

const Actions = styled.div`
  position: absolute;
  background: ${({ theme }) => theme.menu.background};
  border-radius: 4px;
  color: ${({ theme }) => theme.menu.color};
  z-index: ${({ theme }) => theme.zIndex.OVER_1};
`;

const WrapperIcon = styled.div`
  position: relative;
  width: 15px;
  padding: 3px 12px 12px 0;
`;

const Icon = styled(IconComponent)`
  position: absolute;
  top: 0;
  padding-left: 5px;
`;

const H5 = styled(Text.h5)`
  padding-right: 16px;
`;

export default {
  Action,
  Actions,
  Content,
  H5,
  Icon,
  Wrapper,
  WrapperIcon
};
