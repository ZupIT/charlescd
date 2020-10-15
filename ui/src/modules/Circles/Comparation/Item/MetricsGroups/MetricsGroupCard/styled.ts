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

import styled, { css } from 'styled-components';
import SelectComponent from 'core/components/Form/Select';
import Text from 'core/components/Text';
import ButtonIconRoundedComponent from 'core/components/Button/Rounded';
import { HEADINGS_FONT_SIZE } from 'core/components/Text/enums';

interface FilterOpenProps {
  isOpen: boolean;
}

interface ButtonIconProps {
  isActive: boolean;
}

interface ThresholdIconProps {
  color: string;
  hasTreshold: boolean;
}

const MetricsGroupsCard = styled.div`
  background-color: ${({ theme }) =>
    theme.circleGroupMetrics.content.background};
  margin-top: 15px;
  border-radius: 5px;
  width: 520px;
  padding: 20px 20px 0 20px;
`;

const MetricsGroupsCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 20px;
    line-height: 1.5;
  }
`;

const MetricsGroupsCardContent = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 315px;
`;

const MonitoringMetricsFilter = styled.div<FilterOpenProps>`
  padding-top: ${({ isOpen }) => isOpen && '10px'};
  display: flex;

  > * {
    margin-right: 20px;
  }
`;

const MultiSelect = styled(SelectComponent.MultiCheck)`
  width: 130px;
  height: 35px;
  bottom: 10px;

  div:first-child {
    background: transparent;
    border-bottom: none;
  }

  svg > * + * {
    display: none;
  }
`;

const MonitoringMetricsPeriodFilter = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 0px 80px;
`;

const ButtonIconRoundedPeriod = styled(ButtonIconRoundedComponent)`
  height: 17px;
  width: 37px;
  padding: 10px 25px;
  display: flex;
  justify-content: center;

  span {
    font-weight: normal;
    font-size: ${HEADINGS_FONT_SIZE.h6};
  }

  ${({ isActive }: ButtonIconProps) =>
    isActive &&
    css`
      border: solid 1px ${({ theme }) => theme.radio.checked.color};

      span {
        color: ${({ theme }) => theme.radio.checked.color};
      }
    `};
`;

const MetricCardTableHead = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 20px;

  span {
    margin: 0 90px 10px 10px;
  }
`;

const MonitoringMetricsContent = styled.div``;

const MetricCardBody = styled.div`
  background-color: ${({ theme }) => theme.circleGroupMetrics.content.card};
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  border-radius: 5px;
  height: 40px;
`;

const MetricNickname = styled(Text.h5)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 125px;
  margin-left: 10px;
`;

const MetricConditionThreshold = styled.div`
  display: flex;
  width: 125px;
  margin-right: 45px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  span {
    margin-right: 5px;
  }
`;

const MetricLastValueText = styled(Text.h5)`
  margin-right: 10px;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 60px;
  left: 5px;
  top: 2px;
`;

const MetricLastValue = styled.div<ThresholdIconProps>`
  display: flex;

  svg {
    color: ${({ theme, color, hasTreshold }) =>
      hasTreshold
        ? 'transparent'
        : theme.circleGroupMetrics.execution.status[color]};
  }
`;

const MetricDropdown = styled.div`
  margin-right: 10px;
`;

const MetricsGroupsFooter = styled.div`
  border-top: 2px solid
    ${({ theme }) => theme.circleGroupMetrics.footer.borderColor};
  padding-top: 15px;
  margin-top: 15px;
`;

const ActionCardHead = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 20px;

  span {
    margin: 0 90px 10px 20px;
  }
`;

const ActionCardBody = styled.div`
  background-color: ${({ theme }) => theme.circleGroupMetrics.content.card};
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  border-radius: 5px;
  height: 40px;
`;

interface Line {
  status: string;
}

const ActionCardStauts = styled.div<Line>`
  height: calc(100% - 5px);
  width: 5px;
  background-color: ${({ theme, status }) =>
    theme.circleGroupMetrics.action.status[status]};
  margin-left: 5px;
  border-radius: 10px;
`;

const ActionNickname = styled(Text.h5)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 180px;
`;

const ActionType = styled(Text.h5)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 150px;
`;

const ActionTypeTriggeredAt = styled(Text.h5)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 110px;
`;

export default {
  MetricsGroupsCard,
  MetricsGroupsCardHeader,
  MetricsGroupsCardContent,
  MultiSelect,
  MonitoringMetricsFilter,
  MonitoringMetricsPeriodFilter,
  ButtonIconRoundedPeriod,
  MonitoringMetricsContent,
  MetricCardBody,
  MetricNickname,
  MetricConditionThreshold,
  MetricLastValueText,
  MetricLastValue,
  MetricDropdown,
  MetricCardTableHead,
  MetricsGroupsFooter,
  ActionCardHead,
  ActionCardBody,
  ActionCardStauts,
  ActionNickname,
  ActionType,
  ActionTypeTriggeredAt
};
