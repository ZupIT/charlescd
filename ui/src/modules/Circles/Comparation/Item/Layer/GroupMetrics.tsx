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

import React, { memo, useEffect } from 'react';
import Button from 'core/components/Button';
import Text from 'core/components/Text';
import Icon from 'core/components/Icon';
import Layer from 'core/components/Layer';
import ContentIcon from 'core/components/ContentIcon';
import map from 'lodash/map';
import { useGroupMetrics } from '../GroupMetrics/hook';
import { GroupMetrics } from '../GroupMetrics/interface';
import Styled from '../styled';

type Props = {
  onClickCreate: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  circleId: string;
};

const LayerGroupMetrics = ({ onClickCreate, circleId }: Props) => {
  const { getGroupMetrics, metricsGroup, status } = useGroupMetrics();

  useEffect(() => {
    getGroupMetrics(circleId);
  }, [getGroupMetrics]);

  const renderAddGroupMetrics = () => (
    <Button.Rounded
      name={'add'}
      icon={'add'}
      color={'dark'}
      onClick={onClickCreate}
    >
      Add group metrics
    </Button.Rounded>
  );

  const renderGroupMetricsCard = (metrics: GroupMetrics[]) => (
    <>
      {metrics.map(metric => (
        <Styled.GroupMetricsCard key={metric.id}>
          <Text.h5 color={'light'}>{metric.name}</Text.h5>
          <Text.h4 color={'light'}>{metric.status}</Text.h4>
        </Styled.GroupMetricsCard>
      ))}
    </>
  );

  const renderContent = () => {
    return (
      <Styled.GroupMetricsContent>
        <Styled.GroupMetricsHeader>
          <Text.h4 color="dark">Group name</Text.h4>
          <Text.h4 color="dark">Tresholds</Text.h4>
        </Styled.GroupMetricsHeader>
        {renderGroupMetricsCard(metricsGroup)}
        <Styled.GroupMetricsFooter>
          <Text.h4 color="dark">View more</Text.h4>
          <Icon name={'arrow-right'} />
        </Styled.GroupMetricsFooter>
      </Styled.GroupMetricsContent>
    );
  };

  return (
    <Layer data-testid="layer-metrics-group">
      <ContentIcon icon="group-metrics">
        <Text.h2 color="light">Group metrics</Text.h2>
      </ContentIcon>
      <Styled.Content>
        {renderContent()}
        {renderAddGroupMetrics()}
      </Styled.Content>
    </Layer>
  );
};

export default memo(LayerGroupMetrics);
