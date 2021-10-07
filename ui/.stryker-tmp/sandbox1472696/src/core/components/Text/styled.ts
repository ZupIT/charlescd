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
import { fadeIn } from 'core/assets/style/animate';
interface Props {
  fontSize?: string;
  lineHeight?: number;
  fontStyle?: string;
  weight?: string;
  align?: string;
  tag: string;
}
const Text = stryMutAct_9fa48("1191") ? styled.span<Props>`` : (stryCov_9fa48("1191"), styled.span<Props>`
  animation: 0.3s ${fadeIn} linear;
  display: block;
  cursor: ${stryMutAct_9fa48("1192") ? () => undefined : (stryCov_9fa48("1192"), ({
  onClick
}) => onClick ? stryMutAct_9fa48("1193") ? "" : (stryCov_9fa48("1193"), 'pointer') : null)};
  font-style: ${stryMutAct_9fa48("1194") ? () => undefined : (stryCov_9fa48("1194"), ({
  fontStyle
}) => fontStyle)};
  font-size: ${stryMutAct_9fa48("1195") ? () => undefined : (stryCov_9fa48("1195"), ({
  fontSize
}) => fontSize)};
  font-weight: ${stryMutAct_9fa48("1196") ? () => undefined : (stryCov_9fa48("1196"), ({
  weight
}) => weight)};
  color: ${stryMutAct_9fa48("1197") ? () => undefined : (stryCov_9fa48("1197"), ({
  theme,
  color
}) => theme.text[color])};
  text-align: ${stryMutAct_9fa48("1198") ? () => undefined : (stryCov_9fa48("1198"), ({
  align
}) => align)};
  line-height: ${stryMutAct_9fa48("1199") ? () => undefined : (stryCov_9fa48("1199"), ({
  lineHeight,
  fontSize
}) => stryMutAct_9fa48("1202") ? lineHeight && fontSize : stryMutAct_9fa48("1201") ? false : stryMutAct_9fa48("1200") ? true : (stryCov_9fa48("1200", "1201", "1202"), lineHeight || fontSize))};
`);
export default stryMutAct_9fa48("1203") ? {} : (stryCov_9fa48("1203"), {
  Text
});