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
import { scaleIn } from 'core/assets/style/animate';

const Wrapper = styled.div`
  position: relative;
`;

const Content = styled.div``;

const Link = styled.a`
  text-decoration: none;

  :hover {
    text-decoration: underline;
    text-decoration-color: ${({ theme }) => theme.popover.link.decorationColor};
  }
`;

const Popover = styled.div`
  animation: ${scaleIn} 0.15s cubic-bezier(0.2, 0, 0.13, 1.5);
  position: absolute;
  background: ${({ theme }) => theme.popover.background};
  border-radius: 4px;
  padding: 14px 19px;
  width: 258px;
  left: 40px;
  top: -3px;
  box-shadow: 0px 2px 10px 0px ${({ theme }) => theme.popover.shadow};
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  box-sizing: border-box;
  z-index: ${({ theme }) => theme.zIndex.OVER_1};

  > * + * {
    margin-top: 10px;
  }

  :after {
    content: '';
    position: absolute;
    left: 0;
    width: 0;
    height: 0;
    border: 6px solid transparent;
    border-right-color: ${({ theme }) => theme.popover.background};
    border-left: 0;
    margin-top: -5px;
    margin-left: -6px;
  }
`;

export default {
  Link,
  Wrapper,
  Content,
  Popover
};
