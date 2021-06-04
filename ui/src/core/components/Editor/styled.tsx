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

type WrapperProps = {
  width: string;
  height: string;
};

const Wrapper = styled.div<WrapperProps>`
  position: relative;
  ${({ width, height }) =>
    css &&
    `
    width: ${width};
    height: ${height};
  `};
  margin-top: 20px;
  border-radius: 4px;
  ${({ theme }) =>
    css &&
    `
    color: ${theme.editor.color};
    background-color: ${theme.editor.background};
  `}
`;

const Editor = styled.div`
  display: flex;
`;

const Number = styled.span`
  min-width: 35px;
  width: 35px;
  text-align: right;
  ${({ theme }) =>
    css &&
    `
    color: ${theme.editor.color};
    border-right: 1px solid ${theme.editor.lineBorder.background};
  `}
  margin: 0 5px 0 0;
  padding: 0 10px 0 0;
`;

const TextArea = styled.textarea`
  position: absolute;
  right: 0;
  width: calc(100% - 54px);
  height: calc(100% - 20px);
  background: none;
  color: transparent;
  caret-color: ${({ theme }) => theme.editor.color};
  /* border: ; */
  resize: none;
  outline: none;
  margin: 10px 0;
  white-space: pre-wrap;
  word-break: keep-all;
  overflow-wrap: break-word;
  overflow: hidden;
`;

const Pre = styled.pre`
  height: calc(100% - 20px);
  white-space: pre-wrap;
  word-break: keep-all;
  overflow-wrap: break-word;
  overflow: auto;
`;

export default {
  Wrapper,
  Number,
  TextArea,
  Editor,
  Pre,
};
