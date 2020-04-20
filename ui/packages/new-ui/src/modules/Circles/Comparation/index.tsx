import React from 'react';
import map from 'lodash/map';
import reverse from 'lodash/reverse';
import getQueryStrings from 'core/helpers/query';
import CirclesComparationItem from 'modules/Circles/Comparation/Item';
import Styled from './styled';

const CirclesComparation = () => {
  const query = getQueryStrings();
  const circles = query.getAll('circle');

  const renderItems = () =>
    map(reverse(circles), id => <CirclesComparationItem key={id} id={id} />);

  return (
    <Styled.Wrapper data-testid="circles-comparation">
      {renderItems()}
    </Styled.Wrapper>
  );
};

export default CirclesComparation;
