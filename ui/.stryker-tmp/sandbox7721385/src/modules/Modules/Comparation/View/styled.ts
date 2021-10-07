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
import CardConfig from 'core/components/Card/Config';
import ButtonComponentRounded from 'core/components/Button/ButtonRounded';
import Form from 'core/components/Form';
import ContentIcon from 'core/components/ContentIcon';
import ComponentDropdown from 'core/components/Dropdown';
const Layer = stryMutAct_9fa48("5301") ? styled.div`` : (stryCov_9fa48("5301"), styled.div`
  margin: 40px 0;
`);
const ComponentCard = stryMutAct_9fa48("5302") ? styled(CardConfig)`` : (stryCov_9fa48("5302"), styled(CardConfig)`
  margin-top: 10px;
  margin-bottom: 10px;
`);
const ComponentWrapper = stryMutAct_9fa48("5303") ? styled.div`` : (stryCov_9fa48("5303"), styled.div`
  display: flex;
`);
const ComponentIfon = stryMutAct_9fa48("5304") ? styled.div`` : (stryCov_9fa48("5304"), styled.div`
  display: flex;
  width: 120px;
  align-items: center;
  margin-top: 15px;

  > :first-child {
    margin-right: 5px;
  }
`);
const ButtonRounded = stryMutAct_9fa48("5305") ? styled(ButtonComponentRounded)`` : (stryCov_9fa48("5305"), styled(ButtonComponentRounded)`
  margin: 10px 0px;
`);
const InputContentIcon = stryMutAct_9fa48("5306") ? styled(ContentIcon)`` : (stryCov_9fa48("5306"), styled(ContentIcon)`
  > i {
    margin-top: 15px;
  }
`);
const FormLink = stryMutAct_9fa48("5307") ? styled(Form.InputLink)`` : (stryCov_9fa48("5307"), styled(Form.InputLink)`
  width: 393px;
`);
interface StepProp {
  isDisabled: boolean;
}
const Step = stryMutAct_9fa48("5309") ? styled(stryMutAct_9fa48("5308") ? "" : (stryCov_9fa48("5308"), 'div'))<StepProp>`` : (stryCov_9fa48("5309"), styled(stryMutAct_9fa48("5308") ? "" : (stryCov_9fa48("5308"), 'div'))<StepProp>`
  display: ${stryMutAct_9fa48("5310") ? () => undefined : (stryCov_9fa48("5310"), ({
  isDisabled
}) => isDisabled ? stryMutAct_9fa48("5311") ? "" : (stryCov_9fa48("5311"), 'none') : stryMutAct_9fa48("5312") ? "" : (stryCov_9fa48("5312"), 'block'))};
`);
const Dropdown = stryMutAct_9fa48("5313") ? styled(ComponentDropdown)`` : (stryCov_9fa48("5313"), styled(ComponentDropdown)`
  right: 14px;
  top: 0px;
`);
export default stryMutAct_9fa48("5314") ? {} : (stryCov_9fa48("5314"), {
  Layer,
  ButtonRounded,
  InputContentIcon,
  FormLink,
  Component: stryMutAct_9fa48("5315") ? {} : (stryCov_9fa48("5315"), {
    Card: ComponentCard,
    Wrapper: ComponentWrapper,
    Info: ComponentIfon
  }),
  Step,
  Dropdown
});