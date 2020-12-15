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
import { Props } from '.';

interface Header {
  hasCaption?: boolean;
}

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 5px;
  width: 269px;
`;

const Column = styled.div<Partial<Props>>`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  width: 279px;
  height: auto;
  padding-bottom: 10px;
  margin-bottom: 10px;

  ${({ full }) =>
    full &&
    css`
      height: 100%;
    `};

  > * {
    margin-top: 10px;
  }

  scrollbar-width: none;
  scrollbar-color: transparent;

  ::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-color: transparent;
  }
`;

const Header = styled.div<Header>`
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 32px;
  border-bottom: 2px solid ${({ theme }) => theme.board.header.border};
  border-radius: 2px;

  ${({ hasCaption }) =>
    hasCaption &&
    css`
      border: none;
    `}
`;

export default {
  Column,
  Header,
  Wrapper
};
