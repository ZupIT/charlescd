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
import ContentIcon from 'core/components/ContentIcon';
import Text from 'core/components/Text';
import Segments from 'modules/Circles/Segments';
import { Circle } from 'modules/Circles/interfaces/Circle';
import Styled from '../styled';
import ButtonIconRounded from 'core/components/Button/Rounded';

interface Props {
  isEditing: boolean;
  onClickCreate: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  circle: Circle;
}

const LayerSegments = ({ circle, isEditing, onClickCreate }: Props) => {
  const renderContent = () => {
    return isEditing ? (
      <Segments rules={circle?.rules} viewMode />
    ) : (
      <ButtonIconRounded
        name="add"
        color="dark"
        onClick={onClickCreate}
        isDisabled={!circle?.name}
      >
        Create segments
      </ButtonIconRounded>
    );
  };

  return (
    <Styled.Layer>
      <ContentIcon icon="segments">
        <Text.h2 color="light">Segments</Text.h2>
      </ContentIcon>
      <Styled.Content>{renderContent()}</Styled.Content>
    </Styled.Layer>
  );
};

export default LayerSegments;
