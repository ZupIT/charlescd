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
import { CirclePercentagePagination } from 'modules/Circles/interfaces/CirclesPagination';
import { SECTIONS } from '../enums';
import CirclePercentageList from '../Percentage/CirclePercentageList';
import AvailablePercentage from '../Percentage/AvailablePercentage';
import Icon from 'core/components/Icon';

interface Props {
  isEditing: boolean;
  onClickCreate: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  circle: Circle;
  setActiveSection: Function;
  percentageCircles?: CirclePercentagePagination;
}

const renderPercentage = (
  circle: Circle,
  percentageCircles: CirclePercentagePagination,
  setActiveSection: Function
) => {
  return (
    <>
      <AvailablePercentage
        responseGetCircles={percentageCircles}
        circle={circle}
      />
      {!circle.deployment && (
        <Styled.WarningPercentageContainer>
          <Icon name="alert" color="warning" />
          <Text.h4 color="warning">
            The percentage will be activated only when the circle is active.
          </Text.h4>
        </Styled.WarningPercentageContainer>
      )}
      <CirclePercentageList responseGetCircles={percentageCircles} />
      <ButtonIconRounded
        name="add"
        color="dark"
        onClick={() => setActiveSection(SECTIONS.SEGMENTS)}
        isDisabled={!circle?.name}
        icon="edit"
        size="medium"
      >
        Edit segments
      </ButtonIconRounded>
    </>
  );
};

const renderSegments = (
  circle: Circle,
  percentageCircles: CirclePercentagePagination,
  setActiveSection?: Function
) => {
  if (circle.matcherType === 'PERCENTAGE') {
    return renderPercentage(circle, percentageCircles, setActiveSection);
  } else {
    return <Segments rules={circle?.rules} viewMode />;
  }
};

const LayerSegments = ({
  circle,
  isEditing,
  onClickCreate,
  setActiveSection,
  percentageCircles
}: Props) => {
  const renderContent = () => {
    return isEditing ? (
      renderSegments(circle, percentageCircles, setActiveSection)
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
