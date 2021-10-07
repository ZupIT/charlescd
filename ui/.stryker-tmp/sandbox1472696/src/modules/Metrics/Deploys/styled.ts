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
 * distributed under the License is distributed on an "AS IS" BwASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// @ts-nocheck

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
import ComponentButtonDefault from 'core/components/Button/ButtonDefault';
import Chart from 'core/components/Chart';
import SelectComponent from 'core/components/Form/Select';
const Content = stryMutAct_9fa48("5055") ? styled.div`` : (stryCov_9fa48("5055"), styled.div`
  display: flex;
  flex-direction: column;
  padding: 61px 0 80px 37px;
  > * + * {
    margin-top: 20px;
  }
`);
type CardProps = {
  height?: string;
  width?: string;
};
const Plates = stryMutAct_9fa48("5056") ? styled.div`` : (stryCov_9fa48("5056"), styled.div`
  display: flex;
  flex-direction: row;
  > * {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    > :not(:first-child) {
      margin-top: 12px;
    }
  }
  > :not(:first-child) {
    margin-left: 20px;
  }
`);
const Card = stryMutAct_9fa48("5057") ? styled.div<CardProps>`` : (stryCov_9fa48("5057"), styled.div<CardProps>`
  background: ${stryMutAct_9fa48("5058") ? () => undefined : (stryCov_9fa48("5058"), ({
  theme
}) => theme.metrics.dashboard.card)};
  height: ${stryMutAct_9fa48("5059") ? () => undefined : (stryCov_9fa48("5059"), ({
  height
}) => stryMutAct_9fa48("5062") ? height && '94px' : stryMutAct_9fa48("5061") ? false : stryMutAct_9fa48("5060") ? true : (stryCov_9fa48("5060", "5061", "5062"), height || (stryMutAct_9fa48("5063") ? "" : (stryCov_9fa48("5063"), '94px'))))};
  width: ${stryMutAct_9fa48("5064") ? () => undefined : (stryCov_9fa48("5064"), ({
  width
}) => stryMutAct_9fa48("5067") ? width && '175px' : stryMutAct_9fa48("5066") ? false : stryMutAct_9fa48("5065") ? true : (stryCov_9fa48("5065", "5066", "5067"), width || (stryMutAct_9fa48("5068") ? "" : (stryCov_9fa48("5068"), '175px'))))};
  padding: 16px 25px;
  border-radius: 4px;
  box-sizing: border-box;
  position: relative;
`);
const MixedChart = stryMutAct_9fa48("5069") ? styled(Chart)`` : (stryCov_9fa48("5069"), styled(Chart)`
  .apexcharts-gridlines-horizontal > .apexcharts-gridline {
    opacity: 0.2;
  }
`);
const StyledSelect = stryMutAct_9fa48("5070") ? `` : (stryCov_9fa48("5070"), `
  width: 200px;
  padding-right: 30px;
  div:first-child {
    background: transparent;
  }
`);
const SingleSelect = stryMutAct_9fa48("5071") ? styled(SelectComponent.Single)`` : (stryCov_9fa48("5071"), styled(SelectComponent.Single)`
  ${StyledSelect}
`);
const MultiSelect = stryMutAct_9fa48("5072") ? styled(SelectComponent.MultiCheck)`` : (stryCov_9fa48("5072"), styled(SelectComponent.MultiCheck)`
  ${StyledSelect}
`);
const Button = stryMutAct_9fa48("5073") ? styled(ComponentButtonDefault)`` : (stryCov_9fa48("5073"), styled(ComponentButtonDefault)`
  border-radius: 30px;
  margin-top: 10px;
`);
const FilterForm = stryMutAct_9fa48("5074") ? styled.form`` : (stryCov_9fa48("5074"), styled.form`
  display: flex;
  justify-content: space-around;
`);
const ChartControls = stryMutAct_9fa48("5075") ? styled.div`` : (stryCov_9fa48("5075"), styled.div`
  display: flex;
  justify-content: flex-end;
`);
const ChartMenu = stryMutAct_9fa48("5076") ? styled.div`` : (stryCov_9fa48("5076"), styled.div`
  position: absolute;
  top: 15px;
  right: 50px;
  z-index: 999;
`);
export default stryMutAct_9fa48("5077") ? {} : (stryCov_9fa48("5077"), {
  Content,
  Card,
  Plates,
  MixedChart,
  SingleSelect,
  MultiSelect,
  Button,
  FilterForm,
  ChartControls,
  ChartMenu
});