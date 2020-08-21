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
import Text from 'core/components/Text';
import Modal from 'core/components/Modal';
import Dropdown from 'core/components/Dropdown';
import { Metric, MetricsGroup } from './types';
import { useCreateMetricsGroup, useMetricsGroups } from './hooks';
import Styled from './styled';
import AddMetric from './AddMetric';

interface Props {
  id: string;
  onGoBack: Function;
}

// X-cicle-id = b2ccc0c5-464c-4192-a472-b90394766191
//compass

const MetricsGroups = ({ onGoBack, id }: Props) => {
  const [showAddMetricForm, setShowAddMetricForm] = useState(false);
  const [toggleModal, setToggleModal] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [activeMetricsGroup, setActiveMetricsGroup] = useState<MetricsGroup>();
  const {
    createMetricsGroup,
    status: statusCreating
  } = useCreateMetricsGroup();
  const { getMetricsGroups, metricsGroups, status } = useMetricsGroups();
  const { register, handleSubmit, watch } = useForm();
  const name = watch('name');

  useEffect(() => {
    if (name !== null) {
      setIsDisabled(name);
    }
  }, [name, setIsDisabled]);

  useEffect(() => {
    if (status.isIdle) {
      getMetricsGroups(id);
    }
  }, [getMetricsGroups, id, status.isIdle]);

  console.log(metricsGroups, id);

  const onSubmit = async ({ name }: Record<string, string>) => {
    await createMetricsGroup(name, id);
    setToggleModal(false);
    getMetricsGroups(id);
  };

  const handleAddMetric = (metricGroup: MetricsGroup) => {
    setActiveMetricsGroup(metricGroup);
    setShowAddMetricForm(true);
  };

  const handleGoBack = () => {
    setShowAddMetricForm(false);
    getMetricsGroups(id);
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
            isDisabled={!isDisabled}
            isLoading={statusCreating.isPending}
          >
            Add group
          </Styled.Modal.Button>
        </form>
      </Modal.Default>
    );

  const renderMetrics = (metrics: Metric[]) =>
    metrics.map(metric => (
      <Styled.MetricCard key={metric.id}>{metric.nickname}</Styled.MetricCard>
    ));

  const renderMetricsGroupsCards = () =>
    metricsGroups.map(metricGroup => (
      <Styled.MetricsGroupsCard key={metricGroup.id}>
        <Styled.MetricsGroupsCardHeader>
          <Text.h2 color="light">{metricGroup.name}</Text.h2>
          <Dropdown icon="vertical-dots" size="16px">
            <Dropdown.Item
              icon="edit"
              name="Edit metric"
              onClick={() => console.log('edit', metricGroup.id)}
            />
            <Dropdown.Item
              icon="add"
              name="Add metric"
              onClick={() => handleAddMetric(metricGroup)}
            />
            <Dropdown.Item
              icon="delete"
              name="Delete"
              onClick={() => console.log('delete', metricGroup.id)}
            />
          </Dropdown>
        </Styled.MetricsGroupsCardHeader>
        <Styled.MetricsGroupsCardContent>
          {renderMetrics(metricGroup.metrics)}
        </Styled.MetricsGroupsCardContent>
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
    <AddMetric onGoBack={handleGoBack} id={activeMetricsGroup.id} />
  );
};

export default MetricsGroups;
