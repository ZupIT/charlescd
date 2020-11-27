import { CirclePercentagePagination } from 'modules/Circles/interfaces/CirclesPagination';
import React from 'react';
import Styled from './styled';
import Text from 'core/components/Text';
import { Circle } from 'modules/Circles/interfaces/Circle';

interface Props {
  responseGetCircles: CirclePercentagePagination;
  circle?: Circle;
}

const AvailablePercentage = ({ responseGetCircles, circle }: Props) => {
  const getAvailablePercentageInOpenSea = (
    responseGetCircles: CirclePercentagePagination
  ) => {
    return 100 - responseGetCircles?.content[0].sumPercentage;
  };

  return (
    <Styled.AvailableContainer>
      <Styled.AvailableItem>
        <Text.h4 color="light">Open sea</Text.h4>
        <Text.h4 color="light">
          {getAvailablePercentageInOpenSea(responseGetCircles)}%
        </Text.h4>
      </Styled.AvailableItem>
      {circle && (
        <Styled.AvailableItem>
          <Text.h4 color="light">Percent Configured</Text.h4>
          <Text.h4 color="light">{circle.percentage}%</Text.h4>
        </Styled.AvailableItem>
      )}
    </Styled.AvailableContainer>
  );
};

export default AvailablePercentage;
