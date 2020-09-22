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
import ReactTooltip from 'react-tooltip';
import Button from 'core/components/Button';
import Text from 'core/components/Text';
import Icon from 'core/components/Icon';
import Layer from 'core/components/Layer';
import ContentIcon from 'core/components/ContentIcon';
import isEmpty from 'lodash/isEmpty';
import Loader from '../Loaders/index';
import { useMetricsGroupsResume } from '../MetricsGroups/hooks';
import { MetricsGroupsResume } from '../MetricsGroups/types';
import { getThresholdStatus } from '../MetricsGroups/helpers';
import Styled from '../styled';

type Props = {
  onClickCreate: () => void;
  circleId: string;
};

const LayerMetricsGroups = ({ onClickCreate, circleId }: Props) => {
  const { getMetricsgroupsResume, resume, status } = useMetricsGroupsResume();

  useEffect(() => {
    if (status.isIdle) {
      getMetricsgroupsResume({ circleId });
    }
  }, [getMetricsgroupsResume, circleId, status]);

  const renderAddMetricsGroups = () => (
    <Button.Rounded name="add" icon="add" color="dark" onClick={onClickCreate}>
      Add metrics group
    </Button.Rounded>
  );

  const renderMetricsGroupsCard = (metrics: MetricsGroupsResume[]) =>
    metrics?.slice(0, 5).map(metric => {
      const thresholdStatus = getThresholdStatus(metric.status);

      return (
        <Styled.MetricsGroupsCard key={metric?.id}>
          <Styled.MetricsGroupsNameContent color={'light'} title={metric?.name}>
            {metric?.name}
          </Styled.MetricsGroupsNameContent>
          <Styled.MetricsGroupsCountContent color={'light'}>
            {metric.metricsCount}
          </Styled.MetricsGroupsCountContent>
          <Styled.MetricsGroupsThresholdsContent
            hasTreshold={metric.thresholds === 0}
            colorSVG={thresholdStatus.color}
          >
            {!(metric.thresholds === 0) && (
              <Icon
                name={thresholdStatus.icon}
                data-tip
                data-for={`thresholdTooltip-${metric.id}`}
              />
            )}
            <Text.h5
              color={'light'}
              title={`${metric.thresholdsReached} / ${metric.thresholds}`}
            >
              {metric.thresholds === 0
                ? 'Not configured'
                : `${metric.thresholdsReached} / ${metric.thresholds}`}
            </Text.h5>
          </Styled.MetricsGroupsThresholdsContent>
          {!(metric.thresholds === 0) && (
            <ReactTooltip id={`thresholdTooltip-${metric.id}`} place="left">
              {thresholdStatus.ResumeMessage}
            </ReactTooltip>
          )}
        </Styled.MetricsGroupsCard>
      );
    });

  const renderContent = () => {
    return (
      <Styled.MetricsGroupsContent>
        <Styled.MetricsGroupsHeader>
          <Text.h4 color="dark">Group name</Text.h4>
          <Text.h4 color="dark">Metrics</Text.h4>
          <Text.h4 color="dark">Tresholds</Text.h4>
        </Styled.MetricsGroupsHeader>
        {status.isResolved && renderMetricsGroupsCard(resume)}
        <Styled.MetricsGroupsFooter>
          <Text.h4 color="dark" onClick={onClickCreate}>
            View more groups
          </Text.h4>
          <Icon name={'arrow-right'} color={'dark'} onClick={onClickCreate} />
        </Styled.MetricsGroupsFooter>
      </Styled.MetricsGroupsContent>
    );
  };

  return (
    <Layer data-testid="layer-metrics-groups">
      <ContentIcon icon="group-metrics">
        <Text.h2 color="light">Metrics Groups</Text.h2>
      </ContentIcon>
      <Styled.Content>
        {renderAddMetricsGroups()}
        {status.isPending && <Loader.MetricsGroupsLayer />}
        {!isEmpty(resume) && renderContent()}
      </Styled.Content>
    </Layer>
  );
};

export default memo(LayerMetricsGroups);
