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
import Text from 'core/components/Text';
const Toggle = stryMutAct_9fa48("523") ? styled.span`` : (stryCov_9fa48("523"), styled.span`
  position: absolute;
  top: 0;
  left: 0;
  height: 21px;
  width: 21px;
  border: 2px solid ${stryMutAct_9fa48("524") ? () => undefined : (stryCov_9fa48("524"), ({
  theme
}) => theme.checkbox.border)};
  border-radius: 4px;

  ::after {
    content: '';
    position: absolute;
    display: none;
  }
`);
const Input = stryMutAct_9fa48("525") ? styled.input`` : (stryCov_9fa48("525"), styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;

  :checked + ${Toggle} {
    background-color: ${stryMutAct_9fa48("526") ? () => undefined : (stryCov_9fa48("526"), ({
  theme
}) => theme.checkbox.checked.background)};
  }

  :checked + ${Toggle}::before {
    transform: translate3d(10px, 2px, 0) scale3d(0, 0, 0);
  }

  :checked + ${Toggle}::after {
    transform: rotate(45deg);
  }
`);
const Checkbox = stryMutAct_9fa48("527") ? styled.label`` : (stryCov_9fa48("527"), styled.label`
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 35px;
  margin-bottom: 5px;
  cursor: pointer;
  font-size: 22px;
  user-select: none;

  :hover ${Input} ~ ${Toggle} {
    background-color: ${stryMutAct_9fa48("528") ? () => undefined : (stryCov_9fa48("528"), ({
  theme
}) => theme.checkbox.checked.background)};
  }

  ${Input}:checked ~ ${Toggle} {
    background-color: ${stryMutAct_9fa48("529") ? () => undefined : (stryCov_9fa48("529"), ({
  theme
}) => theme.checkbox.checked.background)};
  }

  ${Input}:checked ~ ${Toggle}:after {
    display: block;
  }

  ${Toggle}:after {
    left: 7px;
    top: 3px;
    width: 5px;
    height: 10px;
    border: solid ${stryMutAct_9fa48("530") ? () => undefined : (stryCov_9fa48("530"), ({
  theme
}) => theme.checkbox.checked.mark)};
    border-width: 0 3px 3px 0;
  }
`);
const Label = stryMutAct_9fa48("531") ? styled(Text)`` : (stryCov_9fa48("531"), styled(Text)`
  margin-top: 5px;
`);
const Description = stryMutAct_9fa48("532") ? styled(Text)`` : (stryCov_9fa48("532"), styled(Text)`
  margin-left: 35px;
`);
export default stryMutAct_9fa48("533") ? {} : (stryCov_9fa48("533"), {
  Checkbox,
  Input,
  Toggle,
  Label,
  Description
});