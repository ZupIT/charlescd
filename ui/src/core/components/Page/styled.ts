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
import { Link } from 'react-router-dom';

const Page = styled.div`
  display: grid;
  grid-template-areas: 'menu content';
  grid-template-columns: 300px;
  grid-template-rows: 100vh;
`;

const Menu = styled.div`
  grid-area: menu;
  padding-top: 70px;
  background-color: ${({ theme }) => theme.menuPage.background};
`;

const Content = styled.div`
  grid-area: content;
  overflow-y: auto;
`;

const Placeholder = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 95px;
`;

const PlaceholderText = styled.div`
  margin: 58px 30px 18px 30px;
`;

const PlaceholderCardWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 35px;

  > * {
    margin-right: 25px;
  }
`;

const PlaceholderCard = styled(Link)`
  height: 60px;
  width: 200px;
  border-radius: 5px;
  text-decoration: none;
  display: inline-block;
  background: ${({ theme }) => theme.menuPage.placeholderCard};

  > * {
    margin-left: 15px;
    margin-top: 5px;
  }

  svg {
    margin-top: 5px;
  }
`;

export default {
  Page,
  Menu,
  Content,
  Placeholder,
  PlaceholderText,
  PlaceholderCardWrapper,
  PlaceholderCard
};
