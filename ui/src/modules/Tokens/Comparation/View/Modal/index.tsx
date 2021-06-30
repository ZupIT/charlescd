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

import Styled from './styled';
import Text from 'core/components/Text';
import List from './Content/List';

export interface Props {
  allWorkspaces: boolean;
  tokenWorkspaces?: string[];
  onClose: () => void;
};

const ModalView = ({ onClose, tokenWorkspaces, allWorkspaces }: Props) => {
  return (
    <Styled.Modal onClose={onClose} name='view'>
      <Styled.Header>
        <Text.h2 color="light">View workspaces</Text.h2>
      </Styled.Header>
      <List tokenWorkspaces={tokenWorkspaces} allWorkspaces={allWorkspaces} />
    </Styled.Modal>
  )
}

export default ModalView;