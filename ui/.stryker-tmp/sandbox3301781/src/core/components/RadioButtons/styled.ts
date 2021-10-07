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
import ComponentIcon from 'core/components/Icon';
import ComponentText from 'core/components/Text';
interface LabelProps {
  icon?: string;
  value: string;
}
const RadioButtons = stryMutAct_9fa48("1146") ? styled.div`` : (stryCov_9fa48("1146"), styled.div`
  display: flex;
  flex-direction: row;
  > * + * {
    margin-left: 10px;
  }
`);
const Radio = stryMutAct_9fa48("1147") ? styled.div`Stryker was here!` : (stryCov_9fa48("1147"), styled.div``);
const Icon = stryMutAct_9fa48("1148") ? styled(ComponentIcon)`Stryker was here!` : (stryCov_9fa48("1148"), styled(ComponentIcon)``);
const Text = stryMutAct_9fa48("1149") ? styled(ComponentText)`Stryker was here!` : (stryCov_9fa48("1149"), styled(ComponentText)``);
const Label = stryMutAct_9fa48("1150") ? styled.label<LabelProps>`` : (stryCov_9fa48("1150"), styled.label<LabelProps>`
  padding: ${stryMutAct_9fa48("1151") ? () => undefined : (stryCov_9fa48("1151"), ({
  icon
}) => icon ? stryMutAct_9fa48("1152") ? "" : (stryCov_9fa48("1152"), '12px 30px 12px 30px') : stryMutAct_9fa48("1153") ? "" : (stryCov_9fa48("1153"), '15px 33px 15px 33px'))};
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  > * + * {
    margin-left: 5px;
  }
`);
const Input = stryMutAct_9fa48("1154") ? styled.input`` : (stryCov_9fa48("1154"), styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
  pointer-events: none;
  :checked + ${Label} {
    background-color: ${stryMutAct_9fa48("1155") ? () => undefined : (stryCov_9fa48("1155"), ({
  theme
}) => theme.radio.button.checked.background)};
    transition: 0.2s;
    :hover {
      transform: scale(1.1);
    }
    ${Icon}, ${Text} {
      color: ${stryMutAct_9fa48("1156") ? () => undefined : (stryCov_9fa48("1156"), ({
  theme
}) => theme.radio.button.checked.color)};
    }
  }
  :not(:checked) + ${Label} {
    background-color: ${stryMutAct_9fa48("1157") ? () => undefined : (stryCov_9fa48("1157"), ({
  theme
}) => theme.radio.button.unchecked.background)};
    transition: 0.2s;
    :hover {
      transform: scale(1.1);
    }
    ${Icon}, ${Text} {
      color: ${stryMutAct_9fa48("1158") ? () => undefined : (stryCov_9fa48("1158"), ({
  theme
}) => theme.radio.button.unchecked.color)};
    }
  }
`);
export default stryMutAct_9fa48("1159") ? {} : (stryCov_9fa48("1159"), {
  Input,
  Label,
  Icon,
  Text,
  Radio,
  RadioButtons
});