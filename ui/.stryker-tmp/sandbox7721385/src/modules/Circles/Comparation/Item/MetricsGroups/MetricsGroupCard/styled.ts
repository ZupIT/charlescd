// @ts-nocheck
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
function stryNS_9fa48() {
  var g = new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});

  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }

  function retrieveNS() {
    return ns;
  }

  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}

stryNS_9fa48();

function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });

  function cover() {
    var c = cov.static;

    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }

    var a = arguments;

    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }

  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}

function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();

  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }

      return true;
    }

    return false;
  }

  stryMutAct_9fa48 = isActive;
  return isActive(id);
}

import styled, { css } from 'styled-components';
import SelectComponent from 'core/components/Form/Select';
import Text from 'core/components/Text';
import ButtonIconRoundedComponent from 'core/components/Button/ButtonRounded';
import { baseFontSize } from 'core/components/Text/constants';
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
const MetricsGroupsCard = stryMutAct_9fa48("2995") ? styled.div`` : (stryCov_9fa48("2995"), styled.div`
  background-color: ${stryMutAct_9fa48("2996") ? () => undefined : (stryCov_9fa48("2996"), ({
  theme
}) => theme.circleGroupMetrics.content.background)};
  margin-top: 15px;
  border-radius: 5px;
  width: 520px;
  padding: 20px 20px 0 20px;
`);
const MetricsGroupsCardHeader = stryMutAct_9fa48("2997") ? styled.div`` : (stryCov_9fa48("2997"), styled.div`
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
`);
const MetricsGroupsCardContent = stryMutAct_9fa48("2998") ? styled.div`` : (stryCov_9fa48("2998"), styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 315px;
`);
const MonitoringMetricsFilter = stryMutAct_9fa48("2999") ? styled.div<FilterOpenProps>`` : (stryCov_9fa48("2999"), styled.div<FilterOpenProps>`
  padding-top: ${stryMutAct_9fa48("3000") ? () => undefined : (stryCov_9fa48("3000"), ({
  isOpen
}) => stryMutAct_9fa48("3003") ? isOpen || '10px' : stryMutAct_9fa48("3002") ? false : stryMutAct_9fa48("3001") ? true : (stryCov_9fa48("3001", "3002", "3003"), isOpen && (stryMutAct_9fa48("3004") ? "" : (stryCov_9fa48("3004"), '10px'))))};
  display: flex;

  > * {
    margin-right: 20px;
  }
`);
const MultiSelect = stryMutAct_9fa48("3005") ? styled(SelectComponent.MultiCheck)`` : (stryCov_9fa48("3005"), styled(SelectComponent.MultiCheck)`
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
`);
const MonitoringMetricsPeriodFilter = stryMutAct_9fa48("3006") ? styled.div`` : (stryCov_9fa48("3006"), styled.div`
  display: flex;
  justify-content: space-around;
  padding: 0px 80px;
`);
const ButtonIconRoundedPeriod = stryMutAct_9fa48("3007") ? styled(ButtonIconRoundedComponent)`` : (stryCov_9fa48("3007"), styled(ButtonIconRoundedComponent)`
  height: 17px;
  width: 37px;
  padding: 10px 25px;
  display: flex;
  justify-content: center;

  span {
    font-weight: normal;
    font-size: ${baseFontSize.H6};
  }

  ${stryMutAct_9fa48("3008") ? () => undefined : (stryCov_9fa48("3008"), ({
  isActive
}: ButtonIconProps) => stryMutAct_9fa48("3011") ? isActive || css`
      border: solid 1px ${({
  theme
}) => theme.radio.button.checked.color};

      span {
        color: ${({
  theme
}) => theme.radio.button.checked.color};
      }
    ` : stryMutAct_9fa48("3010") ? false : stryMutAct_9fa48("3009") ? true : (stryCov_9fa48("3009", "3010", "3011"), isActive && (stryMutAct_9fa48("3012") ? css`` : (stryCov_9fa48("3012"), css`
      border: solid 1px ${stryMutAct_9fa48("3013") ? () => undefined : (stryCov_9fa48("3013"), ({
  theme
}) => theme.radio.button.checked.color)};

      span {
        color: ${stryMutAct_9fa48("3014") ? () => undefined : (stryCov_9fa48("3014"), ({
  theme
}) => theme.radio.button.checked.color)};
      }
    `))))};
`);
const MetricCardTableHead = stryMutAct_9fa48("3015") ? styled.div`` : (stryCov_9fa48("3015"), styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 20px;

  span {
    margin: 0 90px 10px 10px;
  }
`);
const MonitoringMetricsContent = stryMutAct_9fa48("3016") ? styled.div`Stryker was here!` : (stryCov_9fa48("3016"), styled.div``);
const MetricCardBody = stryMutAct_9fa48("3017") ? styled.div`` : (stryCov_9fa48("3017"), styled.div`
  background-color: ${stryMutAct_9fa48("3018") ? () => undefined : (stryCov_9fa48("3018"), ({
  theme
}) => theme.circleGroupMetrics.content.card)};
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  border-radius: 5px;
  height: 40px;
`);
const MetricNickname = stryMutAct_9fa48("3019") ? styled(Text)`` : (stryCov_9fa48("3019"), styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 125px;
  margin-left: 10px;
`);
const MetricConditionThreshold = stryMutAct_9fa48("3020") ? styled.div`` : (stryCov_9fa48("3020"), styled.div`
  display: flex;
  width: 125px;
  margin-right: 45px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  span {
    margin-right: 5px;
  }
`);
const MetricLastValueText = stryMutAct_9fa48("3021") ? styled(Text)`` : (stryCov_9fa48("3021"), styled(Text)`
  margin-right: 10px;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 60px;
  left: 5px;
  top: 2px;
`);
const MetricLastValue = stryMutAct_9fa48("3022") ? styled.div<ThresholdIconProps>`` : (stryCov_9fa48("3022"), styled.div<ThresholdIconProps>`
  display: flex;

  svg {
    color: ${stryMutAct_9fa48("3023") ? () => undefined : (stryCov_9fa48("3023"), ({
  theme,
  color,
  hasTreshold
}) => hasTreshold ? stryMutAct_9fa48("3024") ? "" : (stryCov_9fa48("3024"), 'transparent') : theme.circleGroupMetrics.execution.status[color])};
  }
`);
const MetricDropdown = stryMutAct_9fa48("3025") ? styled.div`` : (stryCov_9fa48("3025"), styled.div`
  margin-right: 10px;
`);
const MetricsGroupsFooter = stryMutAct_9fa48("3026") ? styled.div`` : (stryCov_9fa48("3026"), styled.div`
  border-top: 2px solid
    ${stryMutAct_9fa48("3027") ? () => undefined : (stryCov_9fa48("3027"), ({
  theme
}) => theme.circleGroupMetrics.footer.borderColor)};
  padding-top: 15px;
  margin-top: 15px;
`);
const ActionCardHead = stryMutAct_9fa48("3028") ? styled.div`` : (stryCov_9fa48("3028"), styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 20px;

  span {
    margin: 0 100px 10px 20px;
  }
`);
const ActionCardBody = stryMutAct_9fa48("3029") ? styled.div`` : (stryCov_9fa48("3029"), styled.div`
  background-color: ${stryMutAct_9fa48("3030") ? () => undefined : (stryCov_9fa48("3030"), ({
  theme
}) => theme.circleGroupMetrics.content.card)};
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  border-radius: 5px;
  height: 40px;
`);
const ActionCardBodyDelete = stryMutAct_9fa48("3031") ? styled.div`` : (stryCov_9fa48("3031"), styled.div`
  background-color: ${stryMutAct_9fa48("3032") ? () => undefined : (stryCov_9fa48("3032"), ({
  theme
}) => theme.circleGroupMetrics.content.delete)};
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  border-radius: 5px;
  height: 40px;
`);
interface Line {
  status: string;
}
const ActionCardStauts = stryMutAct_9fa48("3033") ? styled.div<Line>`` : (stryCov_9fa48("3033"), styled.div<Line>`
  height: calc(100% - 5px);
  width: 5px;
  background-color: ${stryMutAct_9fa48("3034") ? () => undefined : (stryCov_9fa48("3034"), ({
  theme,
  status
}) => theme.circleGroupMetrics.action.status[status])};
  margin-left: 5px;
  border-radius: 10px;
`);
const ActionNickname = stryMutAct_9fa48("3035") ? styled(Text)`` : (stryCov_9fa48("3035"), styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 180px;
`);
const ActionType = stryMutAct_9fa48("3036") ? styled(Text)`` : (stryCov_9fa48("3036"), styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 150px;
`);
const ActionTypeTriggeredAt = stryMutAct_9fa48("3037") ? styled(Text)`` : (stryCov_9fa48("3037"), styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 125px;
`);
const ActionNicknameDeleteCard = stryMutAct_9fa48("3038") ? styled(Text)`` : (stryCov_9fa48("3038"), styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 215px;
  margin-left: 20px;
`);
const ActionDeleteCardText = stryMutAct_9fa48("3039") ? styled(Text)`` : (stryCov_9fa48("3039"), styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 110px;
`);
export default stryMutAct_9fa48("3040") ? {} : (stryCov_9fa48("3040"), {
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
  ActionTypeTriggeredAt,
  ActionCardBodyDelete,
  ActionDeleteCardText,
  ActionNicknameDeleteCard
});