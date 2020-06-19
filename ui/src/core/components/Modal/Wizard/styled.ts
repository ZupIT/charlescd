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
import ButtonComponent from 'core/components/Button/Rounded';
import IconComponent from 'core/components/Icon';

const Icon = styled(IconComponent)``;

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
  align-items: center;
  z-index: ${({ theme }) => theme.zIndex.OVER_3};
  opacity: 0.8;
`;

const Dialog = styled.div`
  position: relative;
  width: auto;
  margin: 1.75rem auto;
  min-height: calc(100% - (1.75rem * 2));
`;

const Container = styled.div`
  position: fixed;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  z-index: ${({ theme }) => theme.zIndex.OVER_4};
  padding: 26px 21px 26px 30px;
  top: 15%;
  transform: translate(-50%, 0);
  text-align: left;
  width: 784px;
`;

const SideMenu = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.modal.wizard.background.menu};
  z-index: ${({ theme }) => theme.zIndex.OVER_4};
  padding: 26px 21px 26px 30px;
  text-align: left;
  width: 30%;
`;

const Content = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  z-index: ${({ theme }) => theme.zIndex.OVER_4};
  width: 70%;
`;

const Info = styled.div`
  height: 32%;
  position: relative;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.modal.wizard.background.info};
  color: ${({ theme }) => theme.modal.wizard.text.active};
  padding: 28px 52px 0 21px;
  text-align: left;
`;

const Title = styled(Text.h3)``;

const Subtitle = styled(Text.h4)`
  margin-top: 15px;
`;

interface ImageBackgroundProps {
  backgroundColor: string;
}

const ImageBackground = styled.div<ImageBackgroundProps>`
  height: 68%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme, backgroundColor }) =>
    theme.modal.wizard.background[backgroundColor]};
`;

interface ItemProps {
  status: 'unread' | 'read' | 'active';
}

const ItemText = styled(Text.h4)<ItemProps>`
  color: ${({ status, theme }) =>
    status === 'unread'
      ? theme.modal.wizard.text.inactive
      : theme.modal.wizard.text.active};
  margin-left: ${({ status }) => (status === 'active' ? '9px' : '0')};

  :hover {
    transform: scale(1.05);
    color: ${({ theme }) => theme.modal.wizard.text.active};
  }
`;

const Item = styled.div`
  cursor: pointer;
  margin-top: 30px;
  display: flex;
  flex-direction: row;
`;

const ActiveItem = styled.div<ItemProps>`
  display: ${({ status }) => (status === 'active' ? 'flex' : 'none')};
  width: 1px;
  height: 15px;
  box-sizing: border-box;
  border-radius: 1.5px;
  background: ${({ theme }) => theme.modal.wizard.text.active};
`;

export default {
  Wrapper,
  Background,
  Dialog,
  Container,
  SideMenu,
  Button,
  Message,
  Item: {
    Text: ItemText,
    Wrapper: Item,
    Active: ActiveItem
  },
  Info,
  Content: {
    Wrapper: Content,
    Background: ImageBackground,
    Title,
    Subtitle,
    Icon
  }
};
