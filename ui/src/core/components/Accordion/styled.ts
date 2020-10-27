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
import Icon from 'core/components/Icon';

const Wrapper = styled.div`
  width: 100%;
`;

const Item = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.accordion.border};
`;

const Header = styled.div`
  position: relative;
  padding-top: 18px;
  padding-bottom: 18px;
  cursor: pointer;
`;

const Arrow = styled(Icon)`
  position: absolute;
  top: 22px;
  right: 0;
`;

const Body = styled.div``;

export default {
  Wrapper,
  Item,
  Header,
  Arrow,
  Body
};
