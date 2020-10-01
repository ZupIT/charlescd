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

import React, { useState, useEffect } from 'react';
import Text from 'core/components/Text';
import { Metric, MetricsGroup } from './types';
import {
  useMetricsGroups,
  useDeleteMetricsGroup,
  useDeleteMetric
} from './hooks';
import Styled from './styled';
import AddMetric from './AddMetric';
import MetricsGroupsCard from './MetricsGroupCard';
import AddMetricsGroup from './AddMetricsGroup';
import Loader from '../Loaders/index';

interface Props {
  id: string;
  onGoBack: Function;
}

const MetricsGroups = ({ onGoBack, id }: Props) => {
  const [showAddMetricForm, setShowAddMetricForm] = useState(false);
  const [toggleModal, setToggleModal] = useState(false);
  const [activeMetricsGroup, setActiveMetricsGroup] = useState<MetricsGroup>();
  const [activeMetric, setActiveMetric] = useState<Metric>();
  const { deleteMetricsGroup } = useDeleteMetricsGroup();
  const { deleteMetric } = useDeleteMetric();
  const { getMetricsGroups, metricsGroups, status } = useMetricsGroups();

  useEffect(() => {
    if (status.isIdle) {
      getMetricsGroups(id);
    }
  }, [getMetricsGroups, id, status.isIdle]);

  const getNewMetricsGroups = () => {
    getMetricsGroups(id);
  };

  const handleAddMetric = (metricGroup: MetricsGroup) => {
    setActiveMetricsGroup(metricGroup);
    setShowAddMetricForm(true);
  };

  const handleDeleteMetricsGroup = (metricGroupId: string) => {
    deleteMetricsGroup(metricGroupId).then(() => {
      getMetricsGroups(id);
    });
  };

  const handleDeleteMetric = async (
    metricGroupId: string,
    metricId: string
  ) => {
    await deleteMetric(metricGroupId, metricId);
    getMetricsGroups(id);
  };

  const handleEditMetric = (metric: Metric, metricsGroup: MetricsGroup) => {
    setActiveMetricsGroup(metricsGroup);
    setShowAddMetricForm(true);
    setActiveMetric(metric);
  };

  const handleGoBack = () => {
    setShowAddMetricForm(false);
    setActiveMetric(null);
    getMetricsGroups(id);
  };

  return !showAddMetricForm ? (
    <>
      {toggleModal && (
        <AddMetricsGroup
          id={id}
          getNewMetricsGroups={getNewMetricsGroups}
          closeModal={() => setToggleModal(false)}
        />
      )}
      <Styled.Layer data-testid="metrics-groups-list">
        <Styled.Icon
          name="arrow-left"
          color="dark"
          onClick={() => onGoBack()}
        />
      </Styled.Layer>
      <Styled.Layer>
        <Text.h2 color="light">Metrics groups</Text.h2>
        <Styled.Actions>
          <Styled.ButtonAdd
            name="add"
            icon="add"
            color="dark"
            onClick={() => setToggleModal(true)}
          >
            Add metrics group
          </Styled.ButtonAdd>
          <Styled.ButtonAdd
            name="refresh"
            icon="refresh"
            color="dark"
            isDisabled={status.isPending}
            onClick={() => getMetricsGroups(id)}
          >
            Refresh
          </Styled.ButtonAdd>
        </Styled.Actions>
        {status.isPending ? (
          <Loader.MetricsGroupsLayer />
        ) : (
          metricsGroups.map(metricsGroup => (
            <MetricsGroupsCard
              key={metricsGroup.id}
              metricGroup={metricsGroup}
              loadingStatus={status.isPending}
              handleAddMetric={handleAddMetric}
              handleDeleteMetricsGroup={handleDeleteMetricsGroup}
              handleDeleteMetric={handleDeleteMetric}
              handleEditMetric={handleEditMetric}
            />
          ))
        )}
      </Styled.Layer>
    </>
  ) : (
    <AddMetric
      onGoBack={handleGoBack}
      id={activeMetricsGroup?.id}
      metric={activeMetric}
    />
  );
};

export default MetricsGroups;
