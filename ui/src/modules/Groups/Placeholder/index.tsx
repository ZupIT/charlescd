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
import { getProfileByKey } from 'core/utils/profile';
import Text from 'core/components/Text';
import Icon from 'core/components/Icon';
import Styled from './styled';

const Placeholder = () => {
  const profileName = getProfileByKey('name');

  return (
    <>
      <Styled.Wrapper>
        <Icon name="empty-user-groups" />
      </Styled.Wrapper>
      <Styled.Empty>
        <Text.h1 color="dark" weight="bold" align="center">
          Hello, {profileName}!
        </Text.h1>
        <Text.h1 color="dark" weight="bold" align="center">
          Select or create a workspace in the side menu.
        </Text.h1>
      </Styled.Empty>
    </>
  );
};

export default Placeholder;
