/*
 * Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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
import CardRelease, { Props as cardReleaseProps} from 'core/components/Card/Release';
import ContentIcon from 'core/components/ContentIcon';
import ButtonRounded from 'core/components/Button/ButtonRounded';
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
      <CardRelease
        status={circle?.deployment?.status as cardReleaseProps['status']}
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
    <Can I="write" a="deploy" isDisabled={checkIfButtonIsDisabled()} passThrough>
        <ButtonRounded
          icon="add"
          name="add"
          color="dark"
          onClick={onClickCreate}
        >
          Insert release
        </ButtonRounded>
    </Can>
  );

  return (
    <Styled.Layer>
      <ContentIcon icon="release">
        <Text tag="H2" color="light">
          {circle?.deployment ? 'Last release deployed' : 'Release'}
        </Text>
        {!releaseEnabled && (
          <Styled.WarningPercentageContainer>
            <Icon name="alert" color="warning" />
            <Text tag="H4" color="warning">
              The configured percentage is bigger than the available in open
              sea.
            </Text>
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
