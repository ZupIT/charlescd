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

const Wrapper = styled.pre`
  display: flex;
  width: 400px;
  height: 400px;
  margin: 50px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.circleMatcher.editor.background};
  padding: 10px;
  color: white;
`;

const Numbers = styled.ul`
  list-style: none;
  width: 20px;
  height: 100%;
  border-right: 1px solid white;
  margin: 0 5px 0 0;
  padding: 0;
`;
const Content = styled.div``;

export default {
  Wrapper,
  Numbers,
  Content,
};
