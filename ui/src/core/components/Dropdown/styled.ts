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
import { scaleIn } from 'core/assets/style/animate';

type DropDownProps = {
  isBase?: boolean;
};

const Wrapper = styled.div`
  position: relative;
  width: auto;
  height: auto;
`;

const Dropdown = styled.div<DropDownProps>`
  animation: ${scaleIn} 0.15s cubic-bezier(0.2, 0, 0.13, 1.5);
  position: absolute;
  right: 0;
  top: 0;
  background: ${({ theme }) => theme.dropdown.background};
  border-radius: 4px;
  width: 136px;
  box-shadow: 0px 2px 10px 0px ${({ theme }) => theme.dropdown.shadow};
  display: flex;
  overflow-y: auto;
  justify-content: flex-start;
  flex-direction: column;
  z-index: ${({ theme }) => theme.zIndex.OVER_3};

  ${({ isBase }) =>
    isBase &&
    css`
      right: 8px;
      top: 27px;
    `}
`;

const PopperContainer = styled.div`
  z-index: 3;
  background-color: white;
  height: auto;
  width: auto;

  #arrow {
    position: absolute;
    width: 10px;
    height: 10px;
    &:after {
      content: ' ';
      box-shadow: -1px -1px 1px rgba(0, 0, 0, 0.1);
      position: absolute;
      top: -25px;
      left: 0;
      transform: rotate(45deg);
      width: 10px;
      height: 10px;
    }
  }

  &[data-popper-placement^='top'] > #arrow {
    bottom: -30px;
    :after {
      box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
    }
  }
`;

export default {
  Wrapper,
  Dropdown,
  PopperContainer
};
