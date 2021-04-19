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

import Icon from 'core/components/Icon';
import Text from 'core/components/Text';
import Styled from './styled';

const Empty = () => (
  <Styled.Empty>
    <Icon name="workspace-not-found" />
    <Text.h3 color="light">Workspace not found</Text.h3>
    <Text.h3 color="dark">If you want to register one, go to the Workspaces page.</Text.h3>
  </Styled.Empty>
);

export default Empty;
