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
import ModalDefault from 'core/components/Modal/ModalDefault';
import { SearchInput } from 'core/components/Form';
const Modal = stryMutAct_9fa48("6562") ? styled(ModalDefault)`` : (stryCov_9fa48("6562"), styled(ModalDefault)`
  .modal-container {
    width: 543px;
    padding: 35px 0 28px 0;
    max-height: 650px;
    bottom: 100px;
  }

  .modal-content {
    overflow-y: auto;
    max-height: 600px;
  }
`);
const Header = stryMutAct_9fa48("6563") ? styled.div`` : (stryCov_9fa48("6563"), styled.div`
  padding: 0 40px;

  > :last-child {
    margin-top: 20px;
  }
`);
const Search = stryMutAct_9fa48("6564") ? styled(SearchInput)`` : (stryCov_9fa48("6564"), styled(SearchInput)`
  margin-top: 5px;
  margin-bottom: 20px;
  width: 100%;

  > input {
    background-color: transparent;
  }
`);
const Content = stryMutAct_9fa48("6565") ? styled.div`` : (stryCov_9fa48("6565"), styled.div`
  margin-top: 22px;
  max-height: 500px;
  overflow-y: auto;
`);
const Empty = stryMutAct_9fa48("6566") ? styled.div`` : (stryCov_9fa48("6566"), styled.div`
  margin: 48px 30px 18px 30px;
`);
const Item = stryMutAct_9fa48("6567") ? styled.div`` : (stryCov_9fa48("6567"), styled.div`
  border-top: 1px solid ${stryMutAct_9fa48("6568") ? () => undefined : (stryCov_9fa48("6568"), ({
  theme
}) => theme.token.workspace.item.border)};
  border-bottom: 1px solid ${stryMutAct_9fa48("6569") ? () => undefined : (stryCov_9fa48("6569"), ({
  theme
}) => theme.token.workspace.item.border)};
  height: 70px;
  padding: 0 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  :last-child {
    border: hidden;
  }
`);
const Subtitle = stryMutAct_9fa48("6570") ? styled.div`` : (stryCov_9fa48("6570"), styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 5px;
`);
const Description = stryMutAct_9fa48("6571") ? styled.div`` : (stryCov_9fa48("6571"), styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
`);
const Caption = stryMutAct_9fa48("6572") ? styled.div`` : (stryCov_9fa48("6572"), styled.div`
  margin: 10px 40px 20px;
`);
export default stryMutAct_9fa48("6573") ? {} : (stryCov_9fa48("6573"), {
  Content,
  Empty,
  Modal,
  Header,
  Search,
  Item,
  Subtitle,
  Description,
  Caption
});