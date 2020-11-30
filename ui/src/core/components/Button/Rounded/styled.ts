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

type Size = 'small' | 'medium' | 'default';

interface ButtonProps {
  backgroundColor: 'default' | 'primary';
  size: Size;
}

const getButtonHeight = (size: Size) => {
  if (size === 'small') {
    return '30px';
  } else if (size === 'medium') {
    return '40px';
  } else {
    return '50px';
  }
};

const getButtonPadding = (size: Size) => {
  if (size === 'small') {
    return '9px 18px';
  } else if (size === 'medium') {
    return '12px 25px';
  } else {
    return '15px 33px';
  }
};

const getButtonRadius = (size: Size) => {
  if (size === 'small') {
    return '15px';
  } else if (size === 'medium') {
    return '20px';
  } else {
    return '30px';
  }
};

const Button = styled.button<ButtonProps>`
  border: none;
  background: ${({ backgroundColor, theme }) =>
    theme.button.rounded.background[backgroundColor]};
  height: 50px;
  border-radius: ${({ size }) => getButtonRadius(size)};
  height: ${({ size }) => getButtonHeight(size)};
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${({ size }) => getButtonPadding(size)};
  cursor: pointer;
  transition: 0.2s;
  width: fit-content;

  :hover {
    transform: scale(1.03);
  }

  > * + * {
    margin-left: 10px;
  }

  ${({ disabled }) =>
    disabled &&
    css`
      cursor: default;
      opacity: 0.3;

      > * {
        cursor: default;
      }

      :hover {
        transform: scale(1);
      }
    `};
`;

export default {
  Button
};
