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
import ButtonComponentDefault from 'core/components/Button/ButtonDefault';
import LabeledIcon from 'core/components/LabeledIcon';
import Form from 'core/components/Form';
import Text from 'core/components/Text';
import { COLOR_BLACK_MARLIN } from 'core/assets/colors';
const CreateMetricDashboard = stryMutAct_9fa48("5083") ? styled(ButtonComponentDefault)`` : (stryCov_9fa48("5083"), styled(ButtonComponentDefault)`
  background: transparent;
  padding: 0 16px;

  :hover {
    transform: none;
  }
`);
const Content = stryMutAct_9fa48("5084") ? styled.div`` : (stryCov_9fa48("5084"), styled.div`
  height: calc(100vh - 200px);
  overflow-y: auto;
`);
const List = stryMutAct_9fa48("5085") ? styled.ul`` : (stryCov_9fa48("5085"), styled.ul`
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style-type: none;

  > * {
    padding: 0 16px;
  }
`);
const ListItem = stryMutAct_9fa48("5086") ? styled(LabeledIcon)`` : (stryCov_9fa48("5086"), styled(LabeledIcon)`
  padding: 15px 0px;
  cursor: pointer;
  display: flex;
`);
const Item = stryMutAct_9fa48("5087") ? styled(Text)`` : (stryCov_9fa48("5087"), styled(Text)`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 230px;
`);
interface LinkProps {
  isActive: boolean;
}
const Link = stryMutAct_9fa48("5089") ? styled(stryMutAct_9fa48("5088") ? "" : (stryCov_9fa48("5088"), 'button'))<LinkProps>`` : (stryCov_9fa48("5089"), styled(stryMutAct_9fa48("5088") ? "" : (stryCov_9fa48("5088"), 'button'))<LinkProps>`
  background: none;
  border: none;
  text-decoration: none;
  background-color: ${stryMutAct_9fa48("5090") ? () => undefined : (stryCov_9fa48("5090"), ({
  isActive
}) => isActive ? COLOR_BLACK_MARLIN : stryMutAct_9fa48("5091") ? "" : (stryCov_9fa48("5091"), 'transparent'))};
`);
const ModalInput = stryMutAct_9fa48("5092") ? styled(Form.Input)`` : (stryCov_9fa48("5092"), styled(Form.Input)`
  width: 315px;

  > input {
    background-color: ${stryMutAct_9fa48("5093") ? () => undefined : (stryCov_9fa48("5093"), ({
  theme
}) => theme.modal.default.background)};
  }
`);
const ModalTitle = stryMutAct_9fa48("5094") ? styled(Text)`` : (stryCov_9fa48("5094"), styled(Text)`
  margin-bottom: 20px;
`);
const ButtonModal = stryMutAct_9fa48("5095") ? styled(ButtonComponentDefault)`` : (stryCov_9fa48("5095"), styled(ButtonComponentDefault)`
  width: 155px;
  padding-left: 0;
  padding-right: 0;
  margin-top: 20px;
`);
export default stryMutAct_9fa48("5096") ? {} : (stryCov_9fa48("5096"), {
  Content,
  List,
  ListItem,
  Item,
  Link,
  CreateMetricDashboard,
  Modal: stryMutAct_9fa48("5097") ? {} : (stryCov_9fa48("5097"), {
    Input: ModalInput,
    Title: ModalTitle,
    Button: ButtonModal
  })
});