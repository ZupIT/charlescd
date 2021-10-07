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
import LabeledIcon from 'core/components/LabeledIcon';
import SearchInputComponent from 'core/components/Form/SearchInput';
import IconComponent from 'core/components/Icon';
import { COLOR_BLACK_MARLIN } from 'core/assets/colors';
const SearchInput = stryMutAct_9fa48("6352") ? styled(SearchInputComponent)`` : (stryCov_9fa48("6352"), styled(SearchInputComponent)`
  margin: 15px 0;
  padding: 0 16px;
`);
const List = stryMutAct_9fa48("6353") ? styled.ul`` : (stryCov_9fa48("6353"), styled.ul`
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  list-style-type: none;
`);
const ListItem = stryMutAct_9fa48("6354") ? styled(LabeledIcon)`` : (stryCov_9fa48("6354"), styled(LabeledIcon)`
  padding: 15px 8px;
  cursor: pointer;
  display: flex;
`);
const Content = stryMutAct_9fa48("6355") ? styled.div`` : (stryCov_9fa48("6355"), styled.div`
  height: calc(100vh - 200px);
  overflow-y: auto;
`);
const Actions = stryMutAct_9fa48("6356") ? styled.div`` : (stryCov_9fa48("6356"), styled.div`
  > * + * {
    margin-left: 20px;
  }
  padding: 0 16px;
`);
const Icon = stryMutAct_9fa48("6357") ? styled(IconComponent)`` : (stryCov_9fa48("6357"), styled(IconComponent)`
  cursor: pointer;
`);
interface LinkProps {
  isActive: boolean;
}
const A = stryMutAct_9fa48("6358") ? styled.a`` : (stryCov_9fa48("6358"), styled.a`
  text-decoration: none;
`);
const Link = stryMutAct_9fa48("6360") ? styled(stryMutAct_9fa48("6359") ? "" : (stryCov_9fa48("6359"), 'button'))<LinkProps>`` : (stryCov_9fa48("6360"), styled(stryMutAct_9fa48("6359") ? "" : (stryCov_9fa48("6359"), 'button'))<LinkProps>`
  background: none;
  border: none;
  text-decoration: none;
  background-color: ${stryMutAct_9fa48("6361") ? () => undefined : (stryCov_9fa48("6361"), ({
  isActive
}) => isActive ? COLOR_BLACK_MARLIN : stryMutAct_9fa48("6362") ? "" : (stryCov_9fa48("6362"), 'transparent'))};
`);
export default stryMutAct_9fa48("6363") ? {} : (stryCov_9fa48("6363"), {
  A,
  SearchInput,
  List,
  ListItem,
  Content,
  Actions,
  Icon,
  Link
});