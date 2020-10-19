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

import React, { useState } from 'react';
import NewDropDown from 'core/components/Dropdown/NewDropDown';
import Dropdown from 'core/components/Dropdown';
import { dateTimeFormatter } from 'core/utils/date';
import isEmpty from 'lodash/isEmpty';
import camelCase from 'lodash/camelCase';
import Styled from './styled';
import { Action, MetricsGroup } from '../types';

interface Props {
  action: Action;
  metricGroup?: MetricsGroup;
  handleDeleteAction: Function;
  handleEditAction: Function;
}

const ActionCard = ({
  action,
  metricGroup,
  handleDeleteAction,
  handleEditAction
}: Props) => {
  const [deleteView, setDeleteView] = useState(false);

  const deleteBody = () => (
    <Styled.ActionCardBodyDelete>
      <Styled.ActionNickname color="light">
        {action.nickname}
      </Styled.ActionNickname>
      <Styled.ActionType color="light">Are you sure?</Styled.ActionType>
      <Styled.ActionDeleteCardText
        color="light"
        onClick={() => handleDeleteAction(action.id, action.nickname)}
      >
        <u>Yes, delete</u>
      </Styled.ActionDeleteCardText>
      <Styled.ActionDeleteCardText
        color="light"
        onClick={() => setDeleteView(false)}
      >
        No
      </Styled.ActionDeleteCardText>
    </Styled.ActionCardBodyDelete>
  );

  return deleteView ? (
    deleteBody()
  ) : (
    <Styled.ActionCardBody
      key={action.id}
      data-testid={`metric-group-card-${action.nickname}`}
    >
      <Styled.ActionCardStauts
        status={camelCase(action.status)}
        data-testid={`action-status-${camelCase(action.status)}`}
      />
      <Styled.ActionNickname
        color="light"
        title={action.nickname}
        data-testid={`${action.nickname}-action-nickname`}
      >
        {action.nickname}
      </Styled.ActionNickname>
      <Styled.ActionType
        color="light"
        title={action.actionType}
        data-testid={`${action.actionType}-action-type`}
      >
        {action.actionType}
      </Styled.ActionType>
      <Styled.ActionTypeTriggeredAt
        color="light"
        title={action.triggeredAt}
        data-testid={`${action.triggeredAt}-action-triggered`}
      >
        {isEmpty(action.triggeredAt)
          ? ' - '
          : dateTimeFormatter(action.triggeredAt)}
      </Styled.ActionTypeTriggeredAt>
      <Styled.MetricDropdown>
        <NewDropDown icon="vertical-dots" size="16px">
          <Dropdown.Item
            icon="edit"
            name="Edit action"
            onClick={() => handleEditAction(action, metricGroup)}
          />
          <Dropdown.Item
            icon="delete"
            name="Delete action"
            onClick={() => setDeleteView(true)}
          />
        </NewDropDown>
      </Styled.MetricDropdown>
    </Styled.ActionCardBody>
  );
};

export default ActionCard;
