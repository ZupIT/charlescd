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
import { COLOR_BLACK_MARLIN } from 'core/assets/colors';
import AvatarName from 'core/components/AvatarName';
import { Input } from 'core/components/Form';

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

  .modal-user-content {
    padding: 0;
    width: 543px;
    height: 639px;
  }
`;

const Placeholder = styled.div`
  padding: 60px 135.5px 87.5px 135.5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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

const Header = styled.div`
  padding: 25px 50px 0 50px;
`;

const Content = styled.div`
  overflow-y: auto;
  max-height: 100vh;
  border-top: 1px solid ${COLOR_BLACK_MARLIN};
`;

const Search = styled(Input)`
  margin-top: 5px;
  margin-bottom: 20px;

  > input {
    background-color: transparent;
  }
`;

const Label = styled.div`
  color: ${({ theme }) => theme.input.label};
  font-size: 14px;
  margin-top: 20px;
`;

const ItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 50px;
  border-bottom: 1px solid ${COLOR_BLACK_MARLIN};
  cursor: pointer;
  background: ${({ theme }) => theme.modal.default.background};
`;

const ItemProfile = styled.div`
  display: flex;
  flex-direction: row;
`;

const ItemPhoto = styled(AvatarName)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const ItemName = styled.div`
  font-size: 14px;
  font-weight: 900;
`;

const ItemEmail = styled.div`
  font-weight: 300;
`;

const CloseButton = styled.div`
  position: absolute;
  top: 15px;
  right: 10px;
`;

const UpdateButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 50px;
  border-bottom: 1px solid ${COLOR_BLACK_MARLIN};
  cursor: pointer;
`;

const ItemChecked = styled.div``;

const Footer = styled.div``;

export default {
  Wrapper,
  Placeholder,
  Background,
  Dialog,
  Container,
  Header,
  Content,
  Search,
  Label,
  Item: {
    Wrapper: ItemWrapper,
    Profile: ItemProfile,
    Photo: ItemPhoto,
    Name: ItemName,
    Email: ItemEmail,
    Checked: ItemChecked
  },
  Button: {
    Close: CloseButton,
    Update: UpdateButtonWrapper
  },
  Footer
};
