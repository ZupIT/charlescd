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

import { Ref } from 'react';
import styled, { css } from 'styled-components';
import ComponentIcon from 'core/components/Icon';
import Text from 'core/components/Text';
interface InputProps {
  resume?: boolean;
  ref?: Ref<HTMLInputElement>;
  hasError?: boolean;
}
interface WrapperProps {
  type?: string;
}
const Wrapper = stryMutAct_9fa48("534") ? styled.div<WrapperProps>`` : (stryCov_9fa48("534"), styled.div<WrapperProps>`
  position: relative;
  height: 42px;
  ${stryMutAct_9fa48("535") ? () => undefined : (stryCov_9fa48("535"), ({
  type
}) => stryMutAct_9fa48("538") ? type === 'hidden' || css`
      display: none;
    ` : stryMutAct_9fa48("537") ? false : stryMutAct_9fa48("536") ? true : (stryCov_9fa48("536", "537", "538"), (stryMutAct_9fa48("541") ? type !== 'hidden' : stryMutAct_9fa48("540") ? false : stryMutAct_9fa48("539") ? true : (stryCov_9fa48("539", "540", "541"), type === (stryMutAct_9fa48("542") ? "" : (stryCov_9fa48("542"), 'hidden')))) && (stryMutAct_9fa48("543") ? css`` : (stryCov_9fa48("543"), css`
      display: none;
    `))))};
`);
const Label = stryMutAct_9fa48("544") ? styled.label<{
  isFocused: boolean;
  hasError: boolean;
}>`` : (stryCov_9fa48("544"), styled.label<{
  isFocused: boolean;
  hasError: boolean;
}>`
  color: ${stryMutAct_9fa48("545") ? () => undefined : (stryCov_9fa48("545"), ({
  theme,
  hasError
}) => hasError ? theme.input.error.color : theme.input.label)};
  cursor: text;
  font-size: ${stryMutAct_9fa48("546") ? () => undefined : (stryCov_9fa48("546"), ({
  isFocused
}) => isFocused ? stryMutAct_9fa48("547") ? "" : (stryCov_9fa48("547"), '12px') : stryMutAct_9fa48("548") ? "" : (stryCov_9fa48("548"), '14px'))};
  position: absolute;
  top: ${stryMutAct_9fa48("549") ? () => undefined : (stryCov_9fa48("549"), ({
  isFocused
}) => isFocused ? stryMutAct_9fa48("550") ? "" : (stryCov_9fa48("550"), '0px') : stryMutAct_9fa48("551") ? "" : (stryCov_9fa48("551"), '20px'))};
  transition: top 0.1s, font-size 0.1s;
`);
const Input = stryMutAct_9fa48("552") ? styled.input<InputProps>`` : (stryCov_9fa48("552"), styled.input<InputProps>`
  background-color: transparent;
  border: none;
  border-bottom: 1px solid
    ${stryMutAct_9fa48("553") ? () => undefined : (stryCov_9fa48("553"), ({
  theme,
  hasError
}) => hasError ? theme.input.error.borderColor : theme.input.borderColor)};
  border-radius: 0;
  bottom: 0px;
  box-sizing: border-box;
  color: ${stryMutAct_9fa48("554") ? () => undefined : (stryCov_9fa48("554"), ({
  theme
}) => theme.input.color)};
  font-size: 14px;
  padding-bottom: 5px;
  position: absolute;
  width: 100%;

  :focus {
    border-bottom-color: ${stryMutAct_9fa48("555") ? () => undefined : (stryCov_9fa48("555"), ({
  theme
}) => theme.input.focus.borderColor)};

    + ${Label} {
      top: 0px;
    }
  }

  :disabled {
    color: ${stryMutAct_9fa48("556") ? () => undefined : (stryCov_9fa48("556"), ({
  theme
}) => theme.input.disabled.color)};
    border-bottom-color: ${stryMutAct_9fa48("557") ? () => undefined : (stryCov_9fa48("557"), ({
  theme
}) => theme.input.disabled.borderColor)};
  }

  :-webkit-autofill {
    + ${Label} {
      top: 0px;
    }
  }

  ${stryMutAct_9fa48("558") ? () => undefined : (stryCov_9fa48("558"), ({
  resume
}) => stryMutAct_9fa48("561") ? resume || css`
      background: transparent;
      border: none;
    ` : stryMutAct_9fa48("560") ? false : stryMutAct_9fa48("559") ? true : (stryCov_9fa48("559", "560", "561"), resume && (stryMutAct_9fa48("562") ? css`` : (stryCov_9fa48("562"), css`
      background: transparent;
      border: none;
    `))))};
`);
const Tip = stryMutAct_9fa48("563") ? styled.div`` : (stryCov_9fa48("563"), styled.div`
  position: absolute;
  display: block;
  right: 0;
  bottom: 5px;
`);
const Loading = stryMutAct_9fa48("564") ? styled(ComponentIcon)`` : (stryCov_9fa48("564"), styled(ComponentIcon)`
  position: absolute;
  display: block;
  right: 0;
  bottom: 5px;
`);
const Error = stryMutAct_9fa48("565") ? styled(Text)`` : (stryCov_9fa48("565"), styled(Text)`
  position: absolute;
  top: 43px;
`);
const Icon = stryMutAct_9fa48("566") ? styled(ComponentIcon)`` : (stryCov_9fa48("566"), styled(ComponentIcon)`
  position: absolute;
  right: 5px;
  bottom: 5px;
`);
export default stryMutAct_9fa48("567") ? {} : (stryCov_9fa48("567"), {
  Wrapper,
  Input,
  Label,
  Tip,
  Loading,
  Error,
  Icon
});