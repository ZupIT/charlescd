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
import { useForm } from 'react-hook-form';
import isEmpty from 'lodash/isEmpty';
import Text from 'core/components/Text';
import Modal from 'core/components/Modal';
import Dropdown from 'core/components/Dropdown';
import { Metric, MetricsGroup } from './types';
import {
  useCreateMetricsGroup,
  useMetricsGroups,
  useDeleteMetricsGroup,
  useDeleteMetric
} from './hooks';
import Styled from './styled';
import AddMetric from './AddMetric';

interface Props {
  id: string;
  onGoBack: Function;
}

const MetricsGroups = ({ onGoBack, id }: Props) => {
  const [showAddMetricForm, setShowAddMetricForm] = useState(false);
  const [toggleModal, setToggleModal] = useState(false);
  const [activeMetricsGroup, setActiveMetricsGroup] = useState<MetricsGroup>();
  const [activeMetric, setActiveMetric] = useState<Metric>();
  const {
    createMetricsGroup,
    status: statusCreating
  } = useCreateMetricsGroup();
  const { deleteMetricsGroup } = useDeleteMetricsGroup();
  const { deleteMetric } = useDeleteMetric();
  const { getMetricsGroups, metricsGroups, status } = useMetricsGroups();
  const {
    register,
    handleSubmit,
    formState: { isValid }
  } = useForm({ mode: 'onChange' });

  useEffect(() => {
    if (status.isIdle) {
      getMetricsGroups(id);
    }
  }, [getMetricsGroups, id, status.isIdle]);

  const onSubmit = async ({ name }: Record<string, string>) => {
    await createMetricsGroup(name, id);
    setToggleModal(false);
    getMetricsGroups(id);
  };

  const handleAddMetric = (metricGroup: MetricsGroup) => {
    setActiveMetricsGroup(metricGroup);
    setShowAddMetricForm(true);
  };

  const handleDeleteMetricsGroup = (metricGroupId: string) => {
    deleteMetricsGroup(metricGroupId);
    getMetricsGroups(id);
  };

  const handleDeleteMetric = (metricGroupId: string, metricId: string) => {
    deleteMetric(metricGroupId, metricId);
    getMetricsGroups(id);
  };

  const handleGoBack = () => {
    setShowAddMetricForm(false);
    setActiveMetric(null);
    getMetricsGroups(id);
  };

  const handleEditMetric = (metric: Metric) => {
    setShowAddMetricForm(true);
    setActiveMetric(metric);
  };

  const renderModal = () =>
    toggleModal && (
      <Modal.Default onClose={() => setToggleModal(false)}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Styled.Modal.Title color="light">
            Add group metrics
          </Styled.Modal.Title>
          <Styled.Modal.Input
            name="name"
            label="Type a name for the metrics group"
            ref={register({ required: true })}
          />
          <Styled.Modal.Button
            type="submit"
            isDisabled={!isValid}
            isLoading={statusCreating.isPending}
          >
            Add group
          </Styled.Modal.Button>
        </form>
      </Modal.Default>
    );

  const renderMetrics = (metrics: Metric[], metricsGroupId: string) =>
    metrics.map(metric => (
      <Styled.MetricCardBody key={metric.id}>
        <Styled.MetricNickname color="light">
          {metric.nickname}
        </Styled.MetricNickname>
        <Styled.MetricConditionThreshold>
          <Text.h5 color="dark">
            {metric.condition.toLocaleLowerCase()}:
          </Text.h5>
          <Text.h5 color="light">{metric.threshold}</Text.h5>
        </Styled.MetricConditionThreshold>
        <Styled.MetricDropdown>
          <Dropdown icon="vertical-dots" size="16px">
            <Dropdown.Item
              icon="edit"
              name="Edit metric"
              onClick={() => handleEditMetric(metric)}
            />
            <Dropdown.Item
              icon="delete"
              name="Delete"
              onClick={() => handleDeleteMetric(metricsGroupId, metric.id)}
            />
          </Dropdown>
        </Styled.MetricDropdown>
      </Styled.MetricCardBody>
    ));

  const renderMetricsGroupsCards = () =>
    metricsGroups.map(metricGroup => (
      <Styled.MetricsGroupsCard key={metricGroup.id}>
        <Styled.MetricsGroupsCardHeader>
          <Text.h2 color="light">{metricGroup.name}</Text.h2>
          <Dropdown icon="vertical-dots" size="16px">
            <Dropdown.Item
              icon="add"
              name="Add metric"
              onClick={() => handleAddMetric(metricGroup)}
            />
            <Dropdown.Item
              icon="delete"
              name="Delete"
              onClick={() => handleDeleteMetricsGroup(metricGroup.id)}
            />
          </Dropdown>
        </Styled.MetricsGroupsCardHeader>
        {!isEmpty(metricGroup.metrics) && (
          <Styled.MetricsGroupsCardContent>
            <Styled.MetricCardTableHead>
              <Text.h5 color="dark">Nickname</Text.h5>
              <Text.h5 color="dark">Condition Threshold</Text.h5>
            </Styled.MetricCardTableHead>
            {renderMetrics(metricGroup.metrics, metricGroup.id)}
          </Styled.MetricsGroupsCardContent>
        )}
      </Styled.MetricsGroupsCard>
    ));

  return !showAddMetricForm ? (
    <>
      {renderModal()}
      <Styled.Layer>
        <Styled.Icon
          name="arrow-left"
          color="dark"
          onClick={() => onGoBack()}
        />
      </Styled.Layer>
      <Styled.Layer>
        <Text.h2 color="light">Add metrics group</Text.h2>
        <Styled.ButtonAdd
          name="add"
          icon="add"
          color="dark"
          onClick={() => setToggleModal(true)}
        >
          Add metrics group
        </Styled.ButtonAdd>
        {renderMetricsGroupsCards()}
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
