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

import styled, { css } from 'styled-components';
import FormComponent from 'core/components/Form';
import ButtonComponentDefault from 'core/components/Button/ButtonDefault';
import IconComponent from 'core/components/Icon';
import Text from 'core/components/Text';
const Title = stryMutAct_9fa48("6587") ? styled(Text)`` : (stryCov_9fa48("6587"), styled(Text)`
  display: flex;
  align-items: center;

  > :last-child {
    margin-left: 10px;
  }
`);
const InputTitle = stryMutAct_9fa48("6588") ? styled(FormComponent.InputTitle)`` : (stryCov_9fa48("6588"), styled(FormComponent.InputTitle)`
  ${stryMutAct_9fa48("6589") ? () => undefined : (stryCov_9fa48("6589"), ({
  resume
}) => stryMutAct_9fa48("6592") ? !resume || css`
    margin-top: -4px;
  ` : stryMutAct_9fa48("6591") ? false : stryMutAct_9fa48("6590") ? true : (stryCov_9fa48("6590", "6591", "6592"), (stryMutAct_9fa48("6593") ? resume : (stryCov_9fa48("6593"), !resume)) && (stryMutAct_9fa48("6594") ? css`` : (stryCov_9fa48("6594"), css`
    margin-top: -4px;
  `))))}
`);
const Info = stryMutAct_9fa48("6595") ? styled.div`` : (stryCov_9fa48("6595"), styled.div`
  > :first-child {
    margin-bottom: 5px;
  }
`);
const Content = stryMutAct_9fa48("6596") ? styled.div`` : (stryCov_9fa48("6596"), styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  margin-left: 8px;
`);
const Form = stryMutAct_9fa48("6597") ? styled.form`` : (stryCov_9fa48("6597"), styled.form`
  > * {
    margin-top: 20px;
  }
`);
const Input = stryMutAct_9fa48("6598") ? styled(FormComponent.Input)`` : (stryCov_9fa48("6598"), styled(FormComponent.Input)`
  width: 271px;
  margin-bottom: 12px;
`);
const Button = stryMutAct_9fa48("6599") ? styled(ButtonComponentDefault)`` : (stryCov_9fa48("6599"), styled(ButtonComponentDefault)`
  margin-top: 10px;
`);
const Icon = stryMutAct_9fa48("6600") ? styled(IconComponent)`` : (stryCov_9fa48("6600"), styled(IconComponent)`
  margin-bottom: 30px;
`);
export default stryMutAct_9fa48("6601") ? {} : (stryCov_9fa48("6601"), {
  Content,
  Title,
  InputTitle,
  Info,
  Form,
  Input,
  Button,
  Icon
});