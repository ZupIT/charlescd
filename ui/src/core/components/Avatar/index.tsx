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

import React from 'react';
import uppercase from 'lodash/upperCase';
import first from 'lodash/first';
import { Profile } from 'modules/Users/interfaces/User';
import Styled from './styled';

export interface Props {
  size?: string;
  profile: Profile;
}

const Avatar = ({ size, profile }: Props) => (
  <Styled.Wrapper>
    <Styled.Avatar.WithoutPhoto data-testid="avatar" size={size}>
      {uppercase(first(profile.name))}
    </Styled.Avatar.WithoutPhoto>
  </Styled.Wrapper>
);

export default Avatar;
