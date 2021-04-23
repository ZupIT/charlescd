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

interface WrapperProps {
  isOpen?: boolean;
  className?: string;
}

const Wrapper = styled('div')<WrapperProps>`
  display: ${({ isOpen }: WrapperProps) => (!isOpen ? 'none' : 'flex')};
  z-index: ${({ theme }) => theme.zIndex.OVER_4};
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const Header = styled.div`
  background: ${({ theme }) => theme.modal.default.header};
  height: 40px;
  width: 100%;

  i {
    margin-top: 10px;
    margin-left: 15px;
    margin-right: 10px;
  };
`;

const Container = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background: ${({ theme }) => theme.modal.default.background};
  color: ${({ theme }) => theme.modal.default.text};
  text-align: left;
  opacity: 1.2;
  border-radius: 4px;
  height: 100%;
  width: 100%;
`;

const Content = styled.div`
  overflow-y: auto;
  max-height: 100vh;
  height: 100%;
`;

export default {
  Wrapper,
  Container,
  Content,
  Header
};
