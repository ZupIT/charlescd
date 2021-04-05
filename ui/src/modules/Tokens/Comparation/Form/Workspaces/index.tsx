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

import { Fragment, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import map from 'lodash/map';
import ContentIcon from 'core/components/ContentIcon';
import Card from 'core/components/Card';
import Text from 'core/components/Text';
import Modal from './Modal';
import Styled from './styled';
import { isRequired } from 'core/utils/validations';

const data = ['Workspace 1', 'Workspace 2', 'Workspace 3'];

const Workspaces = () => {
  console.log('RENDER Workspaces');
  const { register, setValue } = useFormContext();
  const [isOpen, setIsOpen] = useState<boolean>();

  useEffect(() => {
    register({ name: "workspaces" }, { required: isRequired() });
  }, [register]);

  const toggleIsOpen = () => setIsOpen(!isOpen);

  const renderItems = () =>
    map(data, (workspace) => (
      <Card.Config
        icon="workspaces"
        key={workspace}
        description={workspace}
      />
    ))

  const renderModal = () => 
    isOpen &&
      <Modal
        onClose={toggleIsOpen}
        onContinue={workspaces => setValue('workspaces', workspaces)}
      />
  
  return (
    <Fragment>
      {renderModal()}
      <ContentIcon icon="workspaces">
        <Text.h2 color="light">Associated Workspaces</Text.h2>
        <Styled.Content>
          {data && renderItems()}
        </Styled.Content>
        <Styled.Button
          name="plus-circle"
          icon="plus-circle"
          color="dark"
          onClick={toggleIsOpen}
        >
          Add workspaces
        </Styled.Button>
      </ContentIcon>
    </Fragment>
  )
}

export default Workspaces;
