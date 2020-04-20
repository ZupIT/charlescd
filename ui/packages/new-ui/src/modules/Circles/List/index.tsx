import React, { useEffect } from 'react';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import Text from 'core/components/Text';
import { useGlobalState } from 'core/state/hooks';
import { getProfileByKey } from 'core/utils/profile';
import { CircleState } from '../interfaces/CircleState';
import useCircles, { CIRCLE_TYPES } from '../hooks';
import { getDefaultCircle, prepareCircles } from './helpers';
import CirclesListItem from './Item';
import Loader from './Loaders';
import Styled from './styled';

const CirclesList = () => {
  const [, , getCircles] = useCircles(CIRCLE_TYPES.metrics);
  const { metrics: list } = useGlobalState<CircleState>(
    ({ circles }) => circles
  );
  const profileName = getProfileByKey('name');

  useEffect(() => {
    getCircles();
  }, [getCircles]);

  const renderList = () => (
    <Styled.Content>
      <Styled.Default>
        <CirclesListItem
          key={getDefaultCircle(list?.content)?.id}
          {...getDefaultCircle(list?.content)}
        />
      </Styled.Default>

      <Styled.Items>
        {map(prepareCircles(list?.content), item => (
          <CirclesListItem key={item.id} {...item} />
        ))}
      </Styled.Items>
    </Styled.Content>
  );

  const renderHeader = () => (
    <Styled.Header>
      <Text.h2 color="light">
        {profileName}, this is the health of your circles.
      </Text.h2>
      <Text.h2 color="light">
        You can open a circle for more information.
      </Text.h2>
    </Styled.Header>
  );

  return (
    <Styled.Wrapper>
      {isEmpty(list?.content) ? <Loader.Header /> : renderHeader()}
      {isEmpty(list?.content) ? <Loader.Content /> : renderList()}
    </Styled.Wrapper>
  );
};

export default CirclesList;
