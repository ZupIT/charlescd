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

import React, { useState } from 'react';
import ContentIcon from 'core/components/ContentIcon';
import Text from 'core/components/Text';
import Segments from 'modules/Circles/Segments';
import { Circle } from 'modules/Circles/interfaces/Circle';
import Styled from '../styled';
import StyledPercentage from '../CreateSegments/styled';
import ButtonIconRounded from 'core/components/Button/Rounded';
import { CirclePercentagePagination } from 'modules/Circles/interfaces/CirclesPagination';
import Icon from 'core/components/Icon';
import { SECTIONS } from '../enums';

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
  showCircleList: boolean,
  setShowCircleList: Function,
  setActiveSection: Function
) => {
  return (
    <>
      <StyledPercentage.AvailableContainer>
        <StyledPercentage.AvailableItem>
          <Text.h4 color="light">Open sea</Text.h4>
          <Text.h4 color="light">
            {100 - percentageCircles?.content[0].sumPercentage}%
          </Text.h4>
        </StyledPercentage.AvailableItem>
        <StyledPercentage.AvailableItem>
          <Text.h4 color="light">Percent Configured</Text.h4>
          <Text.h4 color="light">{circle.percentage}%</Text.h4>
        </StyledPercentage.AvailableItem>
      </StyledPercentage.AvailableContainer>
      <StyledPercentage.CirclesListContainer
        onClick={() => setShowCircleList(!showCircleList)}
      >
        <StyledPercentage.CirclesListButton>
          <Icon name={showCircleList ? 'up' : 'alternate-down'} size="18" />
          <Text.h4 color="dark">See consumption by active circles.</Text.h4>
        </StyledPercentage.CirclesListButton>
        {showCircleList && (
          <StyledPercentage.AvailableContainer>
            {percentageCircles?.content[0]?.circles.map(circle => (
              <StyledPercentage.AvailableItem key={circle.id}>
                <Text.h4 color="light">{circle.name}</Text.h4>
                <Text.h4 color="light">{circle.percentage}%</Text.h4>
              </StyledPercentage.AvailableItem>
            ))}
          </StyledPercentage.AvailableContainer>
        )}
      </StyledPercentage.CirclesListContainer>
      <ButtonIconRounded
        name="add"
        color="dark"
        onClick={() => setActiveSection(SECTIONS.SEGMENTS)}
        isDisabled={!circle?.name}
      >
        Edit segments
      </ButtonIconRounded>
    </>
  );
};

const renderSegments = (
  circle: Circle,
  percentageCircles: CirclePercentagePagination,
  showCircleList?: boolean,
  setShowCircleList?: Function,
  setActiveSection?: Function
) => {
  // eslint-disable-next-line no-prototype-builtins
  if (circle.matcherType === 'PERCENTAGE') {
    return renderPercentage(
      circle,
      percentageCircles,
      showCircleList,
      setShowCircleList,
      setActiveSection
    );
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
  const [showCircleList, setShowCircleList] = useState<boolean>(false);
  const renderContent = () => {
    return isEditing ? (
      renderSegments(
        circle,
        percentageCircles,
        showCircleList,
        setShowCircleList,
        setActiveSection
      )
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
