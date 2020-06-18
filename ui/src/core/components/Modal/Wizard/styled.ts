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

import styled from "styled-components";
import Text from "core/components/Text";
import ButtonComponent from "core/components/Button/Rounded";

// ${({ isOpen }: WrapperProps) => (!isOpen ? 'none' : 'flex')};

interface WrapperProps {
  isOpen?: boolean;
  className?: string;
}

const Wrapper = styled("div")<WrapperProps>`
  display: flex
  z-index: ${({ theme }) => theme.zIndex.OVER_3};
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const Button = styled(ButtonComponent)`
  display: flex;
  margin-top: 30px;
`;

const Message = styled.div`
  font-size: 15px;
`;

const Background = styled.div`
  background: ${({ theme }) => theme.modal.wizard.screen};
  width: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: flex-start;
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
  flex-direction: row;
  box-sizing: border-box;
  z-index: ${({ theme }) => theme.zIndex.OVER_4};
  top: 15%;
  transform: translate(-50%, 0);
  text-align: left;
`;

const SideMenu = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background: ${({ theme }) => theme.modal.wizard.background.menu};
  z-index: ${({ theme }) => theme.zIndex.OVER_4};
  padding: 26px 21px 26px 30px;
  transform: translate(-50%, 0);
  text-align: left;
`;

const Info = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background: ${({ theme }) => theme.modal.wizard.background.info};
  z-index: ${({ theme }) => theme.zIndex.OVER_4};
  color: ${({ theme }) => theme.modal.wizard.text};
  transform: translate(-50%, 0);
  text-align: left;
  margin-left: -102px;
`;

const Content = styled.div`
  overflow-y: auto;
  max-height: 100vh;
`;

const Title = styled(Text.h2)`
  text-align: left;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.modal.wizard.text};
`;

interface TextProps {
  isActive?: boolean;
}

const ItemText = styled(Text.h4)<TextProps>`
  color: ${({ isActive, theme }) =>
    isActive
      ? theme.modal.wizard.text.active
      : theme.modal.wizard.text.inactive};
`;

const Item = styled.div`
  margin-top: 30px;
`;

export default {
  Wrapper,
  Background,
  Dialog,
  Container,
  SideMenu,
  Content,
  Button,
  Message,
  Title,
  Item,
  ItemText,
  Info
};
