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

import styled from 'styled-components';
import { slideInLeft, fadeIn } from 'core/assets/style/animate';
import InputTitleComponent from 'core/components/Form/InputTitle';
import Dropdown from 'core/components/Dropdown';
import Text from 'core/components/Text';
interface NoDataThresholds {
  colorSVG: string;
  hasTreshold: boolean;
}
const Wrapper = stryMutAct_9fa48("3498") ? styled.div`` : (stryCov_9fa48("3498"), styled.div`
  animation: 0.2s ${slideInLeft} linear;
`);
const Actions = stryMutAct_9fa48("3499") ? styled.div`` : (stryCov_9fa48("3499"), styled.div`
  margin-left: auto;
  display: flex;
  flex-direction: row;
  align-items: center;

  > :first-child {
    margin-left: 0px;
  }

  > :last-child {
    margin-left: 24px;
  }

  > :nth-last-child(2) {
    margin-left: 24px;
  }
`);
const Action = stryMutAct_9fa48("3500") ? styled(Dropdown.Item)`Stryker was here!` : (stryCov_9fa48("3500"), styled(Dropdown.Item)``);
const Release = stryMutAct_9fa48("3501") ? styled.div`` : (stryCov_9fa48("3501"), styled.div`
  position: relative;
  height: 61px;
  z-index: ${stryMutAct_9fa48("3502") ? () => undefined : (stryCov_9fa48("3502"), ({
  theme
}) => theme.zIndex.OVER_2)};

  > {
    position: absolute;
  }
`);
const Layer = stryMutAct_9fa48("3503") ? styled.div`` : (stryCov_9fa48("3503"), styled.div`
  margin-top: 40px;

  :last-child {
    padding-bottom: 85px;
  }
`);
const Content = stryMutAct_9fa48("3504") ? styled.div`` : (stryCov_9fa48("3504"), styled.div`
  animation: 0.5s ${fadeIn} linear;
  margin-top: 15px;
  margin-left: 45px;
`);
const Link = stryMutAct_9fa48("3505") ? styled.a`` : (stryCov_9fa48("3505"), styled.a`
  text-decoration: none;
`);
const InputTitle = stryMutAct_9fa48("3506") ? styled(InputTitleComponent)`` : (stryCov_9fa48("3506"), styled(InputTitleComponent)`
  .input-title {
    width: 334px;
    height: 31px;
    margin-top: 1px;
  }
`);
const MetricsGroupsHeader = stryMutAct_9fa48("3507") ? styled.div`` : (stryCov_9fa48("3507"), styled.div`
  display: flex;
  padding: 15px 0 0 30px;
  justify-content: space-between;

  span {
    padding-right: 90px;
  }
`);
const MetricsGroupsContent = stryMutAct_9fa48("3508") ? styled.div`` : (stryCov_9fa48("3508"), styled.div`
  background-color: ${stryMutAct_9fa48("3509") ? () => undefined : (stryCov_9fa48("3509"), ({
  theme
}) => theme.circleGroupMetrics.content.background)};
  border-radius: 5px;
  margin-top: 20px;
  margin-bottom: 10px;
  width: 550px;
`);
const MetricsGroupsCountContent = stryMutAct_9fa48("3510") ? styled(Text)`` : (stryCov_9fa48("3510"), styled(Text)`
  margin: auto 60px auto 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 100px;
`);
const MetricsGroupsThresholdsContent = stryMutAct_9fa48("3511") ? styled.div<NoDataThresholds>`` : (stryCov_9fa48("3511"), styled.div<NoDataThresholds>`
  margin: auto 0;
  display: flex;

  span {
    margin-left: ${stryMutAct_9fa48("3512") ? () => undefined : (stryCov_9fa48("3512"), ({
  hasTreshold
}) => hasTreshold ? stryMutAct_9fa48("3513") ? "" : (stryCov_9fa48("3513"), '0') : stryMutAct_9fa48("3514") ? "" : (stryCov_9fa48("3514"), '5px'))};
    margin-top: ${stryMutAct_9fa48("3515") ? () => undefined : (stryCov_9fa48("3515"), ({
  hasTreshold
}) => hasTreshold ? stryMutAct_9fa48("3516") ? "" : (stryCov_9fa48("3516"), '0') : stryMutAct_9fa48("3517") ? "" : (stryCov_9fa48("3517"), '2px'))};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 80px;
  }

  svg {
    color: ${stryMutAct_9fa48("3518") ? () => undefined : (stryCov_9fa48("3518"), ({
  theme,
  colorSVG,
  hasTreshold
}) => hasTreshold ? stryMutAct_9fa48("3519") ? "" : (stryCov_9fa48("3519"), 'transparent') : theme.circleGroupMetrics.execution.status[colorSVG])};
  }
`);
const MetricsGroupsNameContent = stryMutAct_9fa48("3520") ? styled(Text)`` : (stryCov_9fa48("3520"), styled(Text)`
  margin: auto 20px auto 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 180px;
`);
const MetricsGroupsFooter = stryMutAct_9fa48("3521") ? styled.div`` : (stryCov_9fa48("3521"), styled.div`
  display: flex;
  justify-content: flex-end;
  padding-bottom: 15px;
  padding-right: 15px;

  svg {
    padding-top: 4px;
    padding-left: 10px;
  }
`);
const MetricsGroupsCard = stryMutAct_9fa48("3522") ? styled.div`` : (stryCov_9fa48("3522"), styled.div`
  display: flex;
  background-color: ${stryMutAct_9fa48("3523") ? () => undefined : (stryCov_9fa48("3523"), ({
  theme
}) => theme.circleGroupMetrics.content.card)};
  margin: 10px 5px 10px 15px;
  border-radius: 5px;
  width: 520px;
  height: 40px;
`);
const WarningPercentageContainer = stryMutAct_9fa48("3524") ? styled.div`` : (stryCov_9fa48("3524"), styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-top: 15px;
  margin-bottom: 15px;

  > span {
    margin-left: 10px;
  }
`);
const FieldErrorWrapper = stryMutAct_9fa48("3525") ? styled.div`` : (stryCov_9fa48("3525"), styled.div`
  display: flex;
  margin-top: 2px;

  span {
    margin-left: 5px;
    margin-top: 2px;
  }
`);
const A = stryMutAct_9fa48("3526") ? styled.a`` : (stryCov_9fa48("3526"), styled.a`
  text-decoration: none;
  display: inline-flex;
  align-items: center;
`);
export default stryMutAct_9fa48("3527") ? {} : (stryCov_9fa48("3527"), {
  A,
  Link,
  Actions,
  Action,
  Content,
  Layer,
  Release,
  Wrapper,
  InputTitle,
  MetricsGroupsContent,
  MetricsGroupsHeader,
  MetricsGroupsFooter,
  MetricsGroupsCard,
  MetricsGroupsNameContent,
  MetricsGroupsCountContent,
  MetricsGroupsThresholdsContent,
  WarningPercentageContainer,
  FieldErrorWrapper
});