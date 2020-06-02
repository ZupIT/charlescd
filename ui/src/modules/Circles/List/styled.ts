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
import SearchInputComponent from 'core/components/Form/SearchInput';
import IconComponent from 'core/components/Icon';
import Page from 'core/components/Page';

const Content = styled.div`
  display: flex;
  flex-direction: row;
`;

const Wrapper = styled.div`
  margin: 48px 30px 18px 30px;
`;

const PagePlaceholder = styled(Page.Placeholder)`
  svg {
    margin-top: 300px;
  }
`;

const Default = styled.div`
  display: flex;
  margin: 15px 15px 0px 0px;
  align-self: flex-start;
`;

const Items = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  > * {
    margin: 15px;
  }
`;

const Header = styled.div`
  margin-bottom: 18px;
`;

const SearchInput = styled(SearchInputComponent)`
  margin: 15px 0;
`;

const Actions = styled.div`
  > * + * {
    margin-left: 20px;
  }
`;

const Icon = styled(IconComponent)`
  cursor: pointer;
`;

const Placeholder = styled.div`
  display: block;
  margin-top: 148px;
  margin-left: auto;
  margin-right: auto;
  width: 20%;
`;

const Link = styled.a`
  text-decoration: none;
  color: ${({ theme }) => theme.text.primary};
`;

export default {
  Actions,
  Content,
  Default,
  Header,
  Icon,
  Items,
  SearchInput,
  Wrapper,
  Placeholder,
  Link,
  PagePlaceholder
};
