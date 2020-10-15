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
import { Metric, MetricsGroup, Action } from './types';
import {
  useMetricsGroups,
  useDeleteMetricsGroup,
  useDeleteMetric,
  useDeleteAction
} from './hooks';
import Styled from './styled';
import AddMetric from './AddMetric';
import MetricsGroupsCard from './MetricsGroupCard';
import AddMetricsGroup from './AddMetricsGroup';
import Loader from '../Loaders/index';
import { TABS } from './enums';
import AddAction from './AddAction';

interface Props {
  id: string;
  onGoBack: Function;
}

const MetricsGroups = ({ onGoBack, id }: Props) => {
  const [activeTab, setActiveTab] = useState<TABS>(TABS.LIST);
  const [toggleModal, setToggleModal] = useState(false);
  const [activeMetricsGroup, setActiveMetricsGroup] = useState<MetricsGroup>();
  const [activeMetric, setActiveMetric] = useState<Metric>();
  const [ativeAction, setActiveAction] = useState<Action>();
  const { deleteMetricsGroup } = useDeleteMetricsGroup();
  const { deleteMetric } = useDeleteMetric();
  const { deleteAction } = useDeleteAction();
  const { getMetricsGroups, metricsGroups, status } = useMetricsGroups();

  useEffect(() => {
    if (status.isIdle) {
      getMetricsGroups(id);
    }
  }, [getMetricsGroups, id, status.isIdle]);

  const handleAddMetric = (metricGroup: MetricsGroup) => {
    setActiveMetricsGroup(metricGroup);
    setActiveTab(TABS.METRIC);
  };

  const handleAddAction = (metricGroup: MetricsGroup) => {
    setActiveMetricsGroup(metricGroup);
    setActiveTab(TABS.ACTION);
  };

  const handleEditGroup = (metricGroup: MetricsGroup) => {
    setToggleModal(true);
    setActiveMetricsGroup(metricGroup);
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

  const handleDeleteAction = async (actionId: string) => {
    await deleteAction(actionId);
    getMetricsGroups(id);
  };

  const handleEditMetric = (metric: Metric, metricsGroup: MetricsGroup) => {
    setActiveMetricsGroup(metricsGroup);
    setActiveTab(TABS.METRIC);
    setActiveMetric(metric);
  };

  const handleEditAction = (action: Action, metricsGroup: MetricsGroup) => {
    setActiveMetricsGroup(metricsGroup);
    setActiveTab(TABS.ACTION);
    setActiveAction(action);
  };

  const handleGoBack = () => {
    setActiveTab(TABS.LIST);
    setActiveMetric(null);
    setActiveAction(null);
    getMetricsGroups(id);
  };

  const handleCloseModal = () => {
    setToggleModal(false);
    setActiveMetric(null);
    setActiveMetricsGroup(null);
  };

  const handleSaveGroup = () => {
    getMetricsGroups(id);
    handleCloseModal();
  };

  const renderList = () => (
    <>
      {toggleModal && (
        <AddMetricsGroup
          id={id}
          metricGroup={activeMetricsGroup}
          onCloseModal={handleCloseModal}
          onSaveGroup={handleSaveGroup}
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
              handleEditGroup={handleEditGroup}
              handleDeleteMetricsGroup={handleDeleteMetricsGroup}
              handleAddMetric={handleAddMetric}
              handleEditMetric={handleEditMetric}
              handleDeleteMetric={handleDeleteMetric}
              handleAddAction={handleAddAction}
              handleDeleteAction={handleDeleteAction}
              handleEditAction={handleEditAction}
            />
          ))
        )}
      </Styled.Layer>
    </>
  );

  const renderCreateMetric = () => (
    <AddMetric
      onGoBack={handleGoBack}
      id={activeMetricsGroup?.id}
      metric={activeMetric}
    />
  );

  const renderCreateAction = () => (
    <AddAction
      onGoBack={handleGoBack}
      metricsGroup={activeMetricsGroup}
      circleId={id}
      action={ativeAction}
    />
  );

  const renderContentByTab = () => {
    const contentsByTab = {
      [TABS.LIST]: renderList,
      [TABS.METRIC]: renderCreateMetric,
      [TABS.ACTION]: renderCreateAction
    } as Record<TABS, () => JSX.Element>;

    return contentsByTab[activeTab]();
  };

  return renderContentByTab();
};

export default MetricsGroups;
