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
import Text from 'core/components/Text';
import IconComponent from 'core/components/Icon';

interface ExpandItem {
  isExpanded?: boolean;
  isDefault?: boolean;
}

const Wrapper = styled.div<ExpandItem>`
  background-color: ${({ theme }) => theme.metrics.health.cardBackground};

  height: 55px;
  border-radius: 5px;

  display: flex;
  flex-direction: column;
  justify-content: 'space-evenly';

  ${({ isDefault }) =>
    isDefault &&
    css`
      background-color: ${({ theme }) => theme.metrics.health.cardBackground};
      height: 300px;
    `}

  ${({ isExpanded }) =>
    isExpanded &&
    css`
      background-color: ${({ theme }) => theme.metrics.health.cardBackground};
      height: 320px;
      width: 303px;
      position: absolute;
      top: -10px;
      left: 0;
      z-index: 3;
      justify-content: 'unset';
    `}
`;

const Title = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding: 10px 0 0 12px;
`;

const Header = styled.div<ExpandItem>`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin: ${({ isExpanded }) => (!isExpanded ? '7px 0 0 10px' : ' 0 0 0 12px')};
`;

const Variation = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 0 20px;

  svg {
    margin-right: 5px;
  }
`;

const StableIcon = styled(IconComponent)`
  padding-top: 5px;
  margin-right: 5px;
`;

const Icon = styled(IconComponent)`
  margin-left: auto;
  padding-right: 10px;
`;

const Body = styled.div<ExpandItem>`
  margin-left: ${({ isDefault, isExpanded }) =>
    isExpanded !== isDefault ? '4px' : '12px'};

  ${({ isDefault }) =>
    !isDefault &&
    css`
      padding-top: 5px;
    `}
`;

const ModuleCardView = styled.div`
  overflow-y: auto;
  height: 254px;
  margin: 8px 8px 0 0;
`;

const ModuleCardWrapper = styled.div`
  background-color: ${({ theme }) => theme.metrics.health.cardModules};
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 8px 8px 0 8px;
  border-radius: 5px;
  height: 33px;

  svg {
    margin-left: 4px;
  }
`;

const ModuleCardName = styled(Text.h5)<ExpandItem>`
  margin-left: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: ${({ isDefault }) => (isDefault ? '160px' : '190px')};
`;

const ModuleCardVariation = styled(Text.h5)`
  margin-left: auto;
  padding-right: 5px;
`;

export default {
  Wrapper,
  Header,
  Title,
  Variation,
  StableIcon,
  Icon,
  Body,
  ModuleCardView,
  ModuleCardWrapper,
  ModuleCardName,
  ModuleCardVariation
};
