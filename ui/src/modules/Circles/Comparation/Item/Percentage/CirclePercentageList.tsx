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
    !!circles.length && (
      <Styled.CirclesListContainer data-testid="circle-list-container">
        <Styled.CirclesListButton
          data-testid="circle-list-container-button"
          onClick={() => setShowCircleList(!showCircleList)}
        >
          <Icon
            color="light"
            name={showCircleList ? 'up' : 'alternate-down'}
            size="18"
          />
          <Text tag='H4' color="dark">See consumption by active circles.</Text>
        </Styled.CirclesListButton>
        <Styled.CirclesListWrapper>
          {showCircleList && (
            <Styled.AvailableContainer>
              {circles.map(circle => (
                <Styled.AvailableItem
                  data-testid={`circle-percentage-list-item-${circle.id}`}
                  key={circle.id}
                >
                  <Text tag='H4' color="light">{circle.name}</Text>
                  <Text tag='H4' color="light">{circle.percentage}%</Text>
                </Styled.AvailableItem>
              ))}
            </Styled.AvailableContainer>
          )}
        </Styled.CirclesListWrapper>
      </Styled.CirclesListContainer>
    )
  );
};

export default CirclePercentageList;
