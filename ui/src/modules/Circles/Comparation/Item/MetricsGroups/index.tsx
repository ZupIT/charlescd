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
import ReactTooltip from 'react-tooltip';
import isEmpty from 'lodash/isEmpty';
import Icon from 'core/components/Icon';
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
import { getThresholdStatus } from './helpers';
import MonitoringMetrics from './MonitoringMetrics';
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

  const onSubmit = ({ name }: Record<string, string>) => {
    createMetricsGroup(name, id).then(response => {
      if (response) {
        getMetricsGroups(id);
        setToggleModal(false);
      }
    });
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

  const handleGoBack = () => {
    setShowAddMetricForm(false);
    setActiveMetric(null);
    getMetricsGroups(id);
  };

  const handleEditMetric = (metric: Metric, metricsGroup: MetricsGroup) => {
    setActiveMetricsGroup(metricsGroup);
    setShowAddMetricForm(true);
    setActiveMetric(metric);
  };

  const getMetricCondition = (condition: string) => {
    const textByCondition = {
      EQUAL: 'Equal:',
      GREATER_THAN: 'Greater than:',
      LOWER_THAN: 'Lower than:'
    } as Record<string, string>;

    return textByCondition[condition] ?? 'Not configured';
  };

  const renderModal = () =>
    toggleModal && (
      <Modal.Default onClose={() => setToggleModal(false)}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Styled.Modal.Title color="light">
            Add metrics group
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

  const renderMetrics = (metricsGroup: MetricsGroup) =>
    metricsGroup.metrics.map(metric => {
      const thresholdStatus = getThresholdStatus(metric.execution);

      return (
        <Styled.MetricCardBody key={metric.id}>
          <Styled.MetricNickname color="light" title={metric.nickname}>
            {metric.nickname}
          </Styled.MetricNickname>
          <Styled.MetricConditionThreshold>
            <Text.h5 color="dark">
              {getMetricCondition(metric.condition)}
            </Text.h5>
            <Text.h5 color="light" title={metric.threshold.toString()}>
              {metric.threshold !== 0 && metric.threshold}
            </Text.h5>
          </Styled.MetricConditionThreshold>
          <Styled.MetricLastValue color={thresholdStatus.color}>
            <Icon
              name={thresholdStatus.icon}
              data-tip
              data-for={`thresholdTooltip-${metric.id}`}
            />
            <Styled.MetricLastValueText
              color="light"
              title={metric.execution.lastValue.toString()}
            >
              {metric.execution.lastValue}
            </Styled.MetricLastValueText>
            <ReactTooltip id={`thresholdTooltip-${metric.id}`} place="left">
              {thresholdStatus.message}
            </ReactTooltip>
          </Styled.MetricLastValue>
          <Styled.MetricDropdown>
            <Dropdown icon="vertical-dots" size="16px">
              <Dropdown.Item
                icon="edit"
                name="Edit metric"
                onClick={() => handleEditMetric(metric, metricsGroup)}
              />
              <Dropdown.Item
                icon="delete"
                name="Delete"
                onClick={() => handleDeleteMetric(metricsGroup.id, metric.id)}
              />
            </Dropdown>
          </Styled.MetricDropdown>
        </Styled.MetricCardBody>
      );
    });

  const renderMetricsGroupsCards = () =>
    metricsGroups.map(metricGroup => (
      <Styled.MetricsGroupsCard key={metricGroup.id}>
        <Styled.MetricsGroupsCardHeader>
          <Text.h2 color="light" title={metricGroup.name}>
            {metricGroup.name}
          </Text.h2>
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
        <MonitoringMetrics />
        {!isEmpty(metricGroup.metrics) && (
          <>
            <Styled.MetricCardTableHead>
              <Text.h5 color="dark">Nickname</Text.h5>
              <Text.h5 color="dark">Condition Threshold</Text.h5>
              <Text.h5 color="dark">Last Value</Text.h5>
            </Styled.MetricCardTableHead>
            <Styled.MetricsGroupsCardContent>
              {renderMetrics(metricGroup)}
            </Styled.MetricsGroupsCardContent>
          </>
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
        <Text.h2 color="light">Metrics groups</Text.h2>
        <Styled.ButtonAdd
          name="add"
          icon="add"
          color="dark"
          onClick={() => setToggleModal(true)}
        >
          Add metrics group
        </Styled.ButtonAdd>
        {status.isPending ? (
          <Loader.MetricsGroupslayer />
        ) : (
          renderMetricsGroupsCards()
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
