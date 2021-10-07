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
import Text from 'core/components/Text';
import { dark as darkTheme } from 'core/assets/themes/registry';
import SelectSingle from 'core/components/Form/Select/Single/Select';
const Title = stryMutAct_9fa48("6085") ? styled(Text)`` : (stryCov_9fa48("6085"), styled(Text)`
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  > :last-child {
    margin-left: 10px;
  }
`);
const Subtitle = stryMutAct_9fa48("6086") ? styled(Text)`` : (stryCov_9fa48("6086"), styled(Text)`
  margin-bottom: 10px;
`);
const Content = stryMutAct_9fa48("6087") ? styled.div`` : (stryCov_9fa48("6087"), styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  margin-left: 40px;
`);
const Form = stryMutAct_9fa48("6088") ? styled.form`` : (stryCov_9fa48("6088"), styled.form`
  margin-top: 20px;
  width: 271px;
`);
const Fields = stryMutAct_9fa48("6089") ? styled.div`` : (stryCov_9fa48("6089"), styled.div`
  margin: 19px 0 20px 0;

  > * {
    margin-top: 19px;
  }
`);
type status = {
  status: string;
};
const Message = stryMutAct_9fa48("6090") ? styled.div<status>`` : (stryCov_9fa48("6090"), styled.div<status>`
  margin-top: 25px;
  display: flex;
  span {
    margin-left: 10px;
    color: ${stryMutAct_9fa48("6091") ? () => undefined : (stryCov_9fa48("6091"), ({
  status
}) => darkTheme.message[status])};
  }

  svg {
    color: ${stryMutAct_9fa48("6092") ? () => undefined : (stryCov_9fa48("6092"), ({
  status
}) => darkTheme.message[status])};
  }
}
`);
const Select = stryMutAct_9fa48("6093") ? styled(SelectSingle)`` : (stryCov_9fa48("6093"), styled(SelectSingle)`
  width: 271px;
  margin-top: 20px;
`);
const Placeholder = stryMutAct_9fa48("6094") ? styled(Text)`` : (stryCov_9fa48("6094"), styled(Text)`
  pointer-events: none;
  margin-top: -21px;
  margin-left: 45px;
  opacity: 60%;
  overflow: hidden;
`);
export default stryMutAct_9fa48("6095") ? {} : (stryCov_9fa48("6095"), {
  Content,
  Title,
  Subtitle,
  Form,
  Fields,
  Message,
  Select,
  Placeholder
});