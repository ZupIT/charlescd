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

import { Ref } from 'react';
import styled, { css } from 'styled-components';
interface TextAreaProps {
  resume?: boolean;
  ref?: Ref<HTMLTextAreaElement>;
  isFocused: boolean;
}
interface WrapperProps {
  type?: string;
  isFocused: boolean;
}
const Wrapper = stryMutAct_9fa48("817") ? styled.div<WrapperProps>`` : (stryCov_9fa48("817"), styled.div<WrapperProps>`
  height: ${stryMutAct_9fa48("818") ? () => undefined : (stryCov_9fa48("818"), ({
  isFocused
}) => isFocused ? stryMutAct_9fa48("819") ? "" : (stryCov_9fa48("819"), '130px') : stryMutAct_9fa48("820") ? "" : (stryCov_9fa48("820"), '52px'))};
  position: relative;
  ${stryMutAct_9fa48("821") ? () => undefined : (stryCov_9fa48("821"), ({
  type
}) => stryMutAct_9fa48("824") ? type === 'hidden' || css`
      display: none;
    ` : stryMutAct_9fa48("823") ? false : stryMutAct_9fa48("822") ? true : (stryCov_9fa48("822", "823", "824"), (stryMutAct_9fa48("827") ? type !== 'hidden' : stryMutAct_9fa48("826") ? false : stryMutAct_9fa48("825") ? true : (stryCov_9fa48("825", "826", "827"), type === (stryMutAct_9fa48("828") ? "" : (stryCov_9fa48("828"), 'hidden')))) && (stryMutAct_9fa48("829") ? css`` : (stryCov_9fa48("829"), css`
      display: none;
    `))))};
`);
const Label = stryMutAct_9fa48("830") ? styled.label<{
  isFocused: boolean;
}>`` : (stryCov_9fa48("830"), styled.label<{
  isFocused: boolean;
}>`
  position: absolute;
  color: ${stryMutAct_9fa48("831") ? () => undefined : (stryCov_9fa48("831"), ({
  theme
}) => theme.input.label)};
  font-size: 12px;
  top: ${stryMutAct_9fa48("832") ? () => undefined : (stryCov_9fa48("832"), ({
  isFocused
}) => isFocused ? stryMutAct_9fa48("833") ? "" : (stryCov_9fa48("833"), '0px') : stryMutAct_9fa48("834") ? "" : (stryCov_9fa48("834"), '30px'))};
  transition: top 0.1s, font-size 0.1s;
`);
const TextArea = stryMutAct_9fa48("835") ? styled.textarea<TextAreaProps>`` : (stryCov_9fa48("835"), styled.textarea<TextAreaProps>`
  scroll: auto;
  position: absolute;
  border-radius: 0;
  border: none;
  border-bottom: 1px solid ${stryMutAct_9fa48("836") ? () => undefined : (stryCov_9fa48("836"), ({
  theme
}) => theme.input.borderColor)};
  box-sizing: border-box;
  font-size: 14px;
  height: ${stryMutAct_9fa48("837") ? () => undefined : (stryCov_9fa48("837"), ({
  isFocused
}) => isFocused ? stryMutAct_9fa48("838") ? "" : (stryCov_9fa48("838"), '110px') : stryMutAct_9fa48("839") ? "" : (stryCov_9fa48("839"), '32px'))};
  width: 100%;
  background-color: ${stryMutAct_9fa48("840") ? () => undefined : (stryCov_9fa48("840"), ({
  theme
}) => theme.input.background)};
  color: ${stryMutAct_9fa48("841") ? () => undefined : (stryCov_9fa48("841"), ({
  theme
}) => theme.input.color)};
  padding-bottom: 5px;
  bottom: 0px;
  :focus {
    border-bottom-color: ${stryMutAct_9fa48("842") ? () => undefined : (stryCov_9fa48("842"), ({
  theme
}) => theme.input.focus.borderColor)};
  }
  :focus + ${Label} {
    top: 0px;
  }
  :disabled {
    color: ${stryMutAct_9fa48("843") ? () => undefined : (stryCov_9fa48("843"), ({
  theme
}) => theme.input.disabled.color)};
    border-bottom-color: ${stryMutAct_9fa48("844") ? () => undefined : (stryCov_9fa48("844"), ({
  theme
}) => theme.input.disabled.borderColor)};
  }
  ${stryMutAct_9fa48("845") ? () => undefined : (stryCov_9fa48("845"), ({
  resume
}) => stryMutAct_9fa48("848") ? resume || css`
      background: transparent;
      border: none;
    ` : stryMutAct_9fa48("847") ? false : stryMutAct_9fa48("846") ? true : (stryCov_9fa48("846", "847", "848"), resume && (stryMutAct_9fa48("849") ? css`` : (stryCov_9fa48("849"), css`
      background: transparent;
      border: none;
    `))))};
`);
export default stryMutAct_9fa48("850") ? {} : (stryCov_9fa48("850"), {
  Wrapper,
  TextArea,
  Label
});