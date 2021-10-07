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
// @ts-nocheck


import Styled from './styled';
import { getInitials } from './helper';

export interface Props {
  name: string;
  size?: number;
}

const Avatar = ({ name, size = 40 }: Props) => (
  <Styled.Avatar data-testid="avatar">
    <Styled.Initials data-testid="avatar-initials" size={size}>
      {getInitials(name)}
    </Styled.Initials>
  </Styled.Avatar>
);

export default Avatar;
