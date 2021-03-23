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

const Wrapper = styled.div`
  z-index: ${({ theme }) => theme.zIndex.OVER_3};
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
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
  width: 543px;
  height: calc(100vh - 262px);
`;

export default {
  Wrapper,
  Placeholder,
  Background,
  Dialog,
  Container
}