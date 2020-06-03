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
import { HEADINGS } from './enums';
import { fadeIn } from 'core/assets/style/animate';

interface Props {
  fontSize?: string;
  fontStyle?: string;
  weight?: string;
  align?: string;
  type?: HEADINGS;
}

const Text = styled.span<Props>`
  animation: 0.3s ${fadeIn} linear;
  display: block;
  font-style: ${({ fontStyle }) => fontStyle};
  font-size: ${({ fontSize }) => fontSize};
  font-weight: ${({ weight }) => weight};
  color: ${({ theme, color }) => theme.text[color]};
  text-align: ${({ align }) => align};
  line-height: ${({ fontSize }) => fontSize};
`;

export default {
  Text
};
