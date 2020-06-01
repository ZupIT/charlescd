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
import Text from 'core/components/Text';

interface WrapperProps {
  isOpen?: boolean;
  className?: string;
}

const Wrapper = styled('div')<WrapperProps>`
  display: ${({ isOpen }: WrapperProps) => (!isOpen ? 'none' : 'flex')};
  z-index: ${({ theme }) => theme.zIndex.OVER_3};
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const Buttons = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

const Message = styled.div`
  font-size: 15px;
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
  z-index: ${({ theme }) => theme.zIndex.OVER_3};
  opacity: 0.8;
`;

const Dialog = styled.div`
  position: relative;
  width: auto;
  max-width: 500px;
  margin: 1.75rem auto;
  min-height: calc(100% - (1.75rem * 2));
`;

const Container = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background: ${({ theme }) => theme.modal.default.background};
  z-index: ${({ theme }) => theme.zIndex.OVER_4};
  color: ${({ theme }) => theme.modal.default.text};
  padding: 35px 41px 28px 40px;
  top: 15%;
  transform: translate(-50%, 0);
  text-align: left;
  opacity: 1.2;
`;

const Content = styled.div`
  overflow-y: auto;
  max-height: 100vh;
`;

const Title = styled(Text.h2)`
  text-align: left;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.modal.default.text};
`;

const Button = styled.div`
  position: absolute;
  top: 15px;
  right: 10px;
`;

export default {
  Wrapper,
  Background,
  Dialog,
  Container,
  Content,
  Buttons,
  Button,
  Message,
  Title
};
