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
import { useMetricsGroups } from '../MetricsGroups/hook';
import { MetricsGroups } from '../MetricsGroups/interface';
import Styled from '../styled';

type Props = {
  onClickCreate: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  circleId: string;
};

const LayerMetricsGroups = ({ onClickCreate, circleId }: Props) => {
  const { getMetricsGroups, metricsGroups, status } = useMetricsGroups();

  useEffect(() => {
    if (status.isIdle) {
      getMetricsGroups(circleId);
      console.log('group metrics useEffect');
    }
  }, [getMetricsGroups, circleId, status]);

  const renderAddMetricsGroups = () => (
    <Button.Rounded
      name={'add'}
      icon={'add'}
      color={'dark'}
      onClick={onClickCreate}
    >
      Add group metrics
    </Button.Rounded>
  );

  const renderMetricsGroupsCard = (metrics: MetricsGroups[]) => {
    const firstMetricsGroups = metrics?.slice(0, 5);
//alterar o restos dos nomes
//metrics groups
    return firstMetricsGroups?.map(metric => (
      <Styled.GroupMetricsCard key={metric?.id}>
        <Text.h5 color={'light'}>{metric?.name}</Text.h5>
        <Text.h4 color={'light'}>{metric?.status}</Text.h4>
      </Styled.GroupMetricsCard>
    ));
  };

  const renderContent = () => {
    return (
      <Styled.GroupMetricsContent>
        <Styled.GroupMetricsHeader>
          <Text.h4 color="dark">Group name</Text.h4>
          <Text.h4 color="dark">Tresholds</Text.h4>
        </Styled.GroupMetricsHeader>
        {status.isResolved && renderMetricsGroupsCard(metricsGroups)}
        <Styled.GroupMetricsFooter>
          <Text.h4 color="dark">View more</Text.h4>
          <Icon name={'arrow-right'} />
        </Styled.GroupMetricsFooter>
      </Styled.GroupMetricsContent>
    );
  };

  return (
    <Layer data-testid="layer-metrics-groups">
      <ContentIcon icon="group-metrics">
        <Text.h2 color="light">Group metrics</Text.h2>
      </ContentIcon>
      <Styled.Content>
        {renderContent()}
        {renderAddMetricsGroups()}
      </Styled.Content>
    </Layer>
  );
};

export default memo(LayerMetricsGroups);
