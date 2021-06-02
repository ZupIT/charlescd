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
import styled, { css } from 'styled-components';

const Wrapper = styled.pre`
  display: flex;
  width: 200px;
  height: 100px;
  margin: 50px;
  border-radius: 4px;
  ${({ theme }) =>
    css &&
    `
    color: ${theme.editor.color};
    background-color: ${theme.editor.background};
  `}
  padding: 10px;
`;

const Numbers = styled.ul`
  list-style: none;
  width: 40px;
  height: 100%;
  text-align: right;
  border-right: 1px solid ${({ theme }) => theme.editor.lineBorder.background};
  margin: 0 5px 0 0;
  padding: 0 10px 0 0;
  overflow: hidden;
`;

const Content = styled.div``;

const Editor = styled.textarea`
  width: 100%;
  height: 100%;
  background: none;
  border: none;
  resize: none;
  color: ${({ theme }) => theme.editor.color};
  outline: none;
`;

export default {
  Wrapper,
  Numbers,
  Content,
  Editor,
};
