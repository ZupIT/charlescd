import React, { useState } from 'react';
import get from 'lodash/get';
import { CirclePercentagePagination } from 'modules/Circles/interfaces/CirclesPagination';
import { Circle } from 'modules/Circles/interfaces/Circle';
import Styled from './styled';
import Icon from 'core/components/Icon';
import Text from 'core/components/Text';

interface Props {
  responseGetCircles: CirclePercentagePagination;
}

const CirclePercentageList = ({ responseGetCircles }: Props) => {
  const circles: Circle[] = get(responseGetCircles, 'content[0].circles', []);
  const [showCircleList, setShowCircleList] = useState<boolean>(false);
  return (
    <Styled.CirclesListContainer
      onClick={() => setShowCircleList(!showCircleList)}
    >
      <Styled.CirclesListButton>
        <Icon name={showCircleList ? 'up' : 'alternate-down'} size="18" />
        <Text.h4 color="dark">See consumption by active circles.</Text.h4>
      </Styled.CirclesListButton>
      {showCircleList && (
        <Styled.AvailableContainer>
          {circles.map(circle => (
            <Styled.AvailableItem key={circle.id}>
              <Text.h4 color="light">{circle.name}</Text.h4>
              <Text.h4 color="light">{circle.percentage}%</Text.h4>
            </Styled.AvailableItem>
          ))}
        </Styled.AvailableContainer>
      )}
    </Styled.CirclesListContainer>
  );
};

export default CirclePercentageList;
