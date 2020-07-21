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
import Card from 'core/components/Card';
import ContentIcon from 'core/components/ContentIcon';
import Button from 'core/components/Button';
import Text from 'core/components/Text';
import { Deployment, Circle } from 'modules/Circles/interfaces/Circle';
import Styled from '../styled';

interface Props {
  onClickCreate: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  circle: Circle;
}

const LayerRelease = ({ circle, onClickCreate }: Props) => {
  const renderRelease = ({ tag, artifacts }: Deployment) => (
    <Styled.Release>
      <Card.Release
        status={circle?.deployment?.status}
        description={tag}
        expandItems={artifacts}
      />
    </Styled.Release>
  );

  const renderButton = () => (
    <Button.Rounded
      name="add"
      icon="add"
      color="dark"
      onClick={onClickCreate}
      isDisabled={!circle?.id}
    >
      Insert release
    </Button.Rounded>
  );

  return (
    <Styled.Layer>
      <ContentIcon icon="release">
        <Text.h2 color="light">
          {circle?.deployment ? 'Last release deployed' : 'Release'}
        </Text.h2>
      </ContentIcon>
      <Styled.Content>
        {circle?.deployment
          ? renderRelease(circle?.deployment)
          : renderButton()}
      </Styled.Content>
    </Styled.Layer>
  );
};

export default LayerRelease;
