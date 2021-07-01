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
import Icon from 'core/components/Icon';
import Can from 'containers/Can';

interface Props {
  onClickCreate: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  circle: Circle;
  releaseEnabled: boolean;
}

const LayerRelease = ({ circle, onClickCreate, releaseEnabled }: Props) => {
  const renderRelease = ({ tag, artifacts }: Deployment) => (
    <Styled.Release>
      <Card.Release
        status={circle?.deployment?.status}
        description={tag}
        expandItems={artifacts}
      />
    </Styled.Release>
  );

  const checkIfButtonIsDisabled = () => {
    if (!circle?.id) {
      return true;
    } else if (!releaseEnabled) {
      return true;
    }
    return false;
  };

  const renderButton = () => (
    <Can I="write" a="deploy" passThrough>
        <Button.Rounded
          icon="add"
          name="add"
          color="dark"
          onClick={onClickCreate}
          isDisabled={checkIfButtonIsDisabled()}
        >
          Insert release
        </Button.Rounded>
    </Can>
  );

  return (
    <Styled.Layer>
      <ContentIcon icon="release">
        <Text.h2 color="light">
          {circle?.deployment ? 'Last release deployed' : 'Release'}
        </Text.h2>
        {!releaseEnabled && (
          <Styled.WarningPercentageContainer>
            <Icon name="alert" color="warning" />
            <Text.h4 color="warning">
              The configured percentage is bigger than the available in open sea.
            </Text.h4>
          </Styled.WarningPercentageContainer>
        )}
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
