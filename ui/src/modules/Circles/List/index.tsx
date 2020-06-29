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

import React, { useEffect } from 'react';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import Text from 'core/components/Text';
import Placeholder from 'core/components/Placeholder';
import { useGlobalState } from 'core/state/hooks';
import { getProfileByKey } from 'core/utils/profile';
import { getWorkspaceId } from 'core/utils/workspace';
import routes from 'core/constants/routes';
import { CircleState } from '../interfaces/CircleState';
import useCircles, { CIRCLE_TYPES } from '../hooks';
import { useWorkspace } from 'modules/Settings/hooks';
import { prepareCircles, getDefaultCircle } from './helpers';
import CirclesListItem from './Item';
import Loader from './Loaders';
import Styled from './styled';

const CirclesList = () => {
  const [loading, , getCircles] = useCircles(CIRCLE_TYPES.metrics);
  const { metrics: list } = useGlobalState<CircleState>(
    ({ circles }) => circles
  );
  const [response, loadWorkspace] = useWorkspace();
  const profileName = getProfileByKey('name');

  useEffect(() => {
    if (response === undefined) {
      loadWorkspace(getWorkspaceId());
    }
  }, [loadWorkspace, response]);

  useEffect(() => {
    getCircles();
  }, [getCircles]);

  const renderList = () =>
    !isEmpty(list?.content) && (
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

  const renderHeader = () =>
    !isEmpty(list?.content) && (
      <Styled.Header>
        <Text.h2 color="light">
          {profileName}, this is the health of your circles.
        </Text.h2>
        <Text.h2 color="light">
          You can open a circle for more information.
        </Text.h2>
      </Styled.Header>
    );

  const renderPlaceholder = () =>
    isEmpty(list?.content) && (
      <Placeholder
        icon="empty-circles"
        title={`Welcome, ${profileName}!`}
        subtitle=" What you'd like to do?"
      />
    );

  const renderMetrics = () => (
    <>
      {loading ? <Loader.Header /> : renderHeader()}
      {loading ? <Loader.Content /> : renderList()}
      {!loading && renderPlaceholder()}
    </>
  );

  const renderNoMetrics = () => (
    <Styled.PagePlaceholder
      icon="placeholder-metrics"
      title={`${profileName}!`}
      hasCards={false}
    >
      <Text.h1 color="dark" align="center" weight="bold">
        You need{' '}
        <Styled.Link href={routes.credentials}>to add your</Styled.Link> metrics
        provider configuration to get health from your circles.
      </Text.h1>
    </Styled.PagePlaceholder>
  );

  return (
    <Styled.Wrapper>
      {isEmpty(response?.metricConfiguration) && !loading
        ? renderNoMetrics()
        : renderMetrics()}
    </Styled.Wrapper>
  );
};

export default CirclesList;
