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
import LabeledIcon from 'core/components/LabeledIcon';
import SearchInputComponent from 'core/components/Form/SearchInput';
import IconComponent from 'core/components/Icon';
import ButtonComponentDefault from 'core/components/Button/ButtonDefault';
import Text from 'core/components/Text';
import LoaderMenuComponent from './Loaders';
const SearchInput = stryMutAct_9fa48("7076") ? styled(SearchInputComponent)`` : (stryCov_9fa48("7076"), styled(SearchInputComponent)`
  margin: 15px 0;
  padding: 0 16px;
`);
const List = stryMutAct_9fa48("7077") ? styled.ul`` : (stryCov_9fa48("7077"), styled.ul`
  padding: 0 16px;
  margin: 0;
  list-style-type: none;
`);
const ListItem = stryMutAct_9fa48("7078") ? styled(LabeledIcon)`` : (stryCov_9fa48("7078"), styled(LabeledIcon)`
  padding: 15px 0;
  cursor: pointer;
  display: flex;
`);
const Content = stryMutAct_9fa48("7079") ? styled.div`` : (stryCov_9fa48("7079"), styled.div`
  height: calc(100vh - 250px);
`);
const Actions = stryMutAct_9fa48("7080") ? styled.div`` : (stryCov_9fa48("7080"), styled.div`
  > * + * {
    margin-left: 20px;
  }
  padding: 0 16px;
`);
const Icon = stryMutAct_9fa48("7081") ? styled(IconComponent)`` : (stryCov_9fa48("7081"), styled(IconComponent)`
  cursor: pointer;
`);
const Link = stryMutAct_9fa48("7082") ? styled.button`` : (stryCov_9fa48("7082"), styled.button`
  display: block;
  padding: 0 16px;
  background: none;
  border: none;
  margin: 0;
  text-decoration: none;
`);
const Button = stryMutAct_9fa48("7083") ? styled(ButtonComponentDefault)`` : (stryCov_9fa48("7083"), styled(ButtonComponentDefault)`
  border: none;
  background-color: transparent;
  padding: 0;
  margin: 0;
  height: auto;
`);
const Item = stryMutAct_9fa48("7084") ? styled(Text)`` : (stryCov_9fa48("7084"), styled(Text)`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 230px;
`);
const Empty = stryMutAct_9fa48("7085") ? styled.div`` : (stryCov_9fa48("7085"), styled.div`
  padding: 0 16px;
`);
const Loader = stryMutAct_9fa48("7086") ? styled(LoaderMenuComponent.List)`` : (stryCov_9fa48("7086"), styled(LoaderMenuComponent.List)`
  padding: 0 16px;
`);
export default stryMutAct_9fa48("7087") ? {} : (stryCov_9fa48("7087"), {
  Item,
  SearchInput,
  List,
  ListItem,
  Loader,
  Content,
  Actions,
  Icon,
  Link,
  Button,
  Empty
});