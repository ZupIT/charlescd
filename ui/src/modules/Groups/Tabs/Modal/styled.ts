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
import Modal from 'core/components/Modal';
import { COLOR_BLACK_MARLIN } from 'core/assets/colors';
import AvatarName from 'core/components/AvatarName';
import { Input } from 'core/components/Form';

const Wrapper = styled(Modal.Default)`
  padding: 0;

  .modal-content {
    padding: 0;
    width: 543px;
  }
`;

const Header = styled.div`
  padding: 25px 50px 0 50px;
`;

const Content = styled.div`
  overflow-y: auto;
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

const ItemChecked = styled.div``;

const Footer = styled.div``;

export default {
  Wrapper,
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
  Footer
};
