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
import { Link } from 'react-router-dom';
const Page = stryMutAct_9fa48("1110") ? styled.div`` : (stryCov_9fa48("1110"), styled.div`
  display: grid;
  grid-template-areas: 'menu content';
  grid-template-columns: 300px;
  grid-template-rows: 100vh;
`);
const Menu = stryMutAct_9fa48("1111") ? styled.div`` : (stryCov_9fa48("1111"), styled.div`
  grid-area: menu;
  padding-top: 63px;
  background-color: ${stryMutAct_9fa48("1112") ? () => undefined : (stryCov_9fa48("1112"), ({
  theme
}) => theme.menuPage.background)};
`);
const Content = stryMutAct_9fa48("1113") ? styled.div`` : (stryCov_9fa48("1113"), styled.div`
  grid-area: content;
  overflow-y: auto;
`);
const Placeholder = stryMutAct_9fa48("1114") ? styled.div`` : (stryCov_9fa48("1114"), styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 95px;
`);
const PlaceholderText = stryMutAct_9fa48("1115") ? styled.div`` : (stryCov_9fa48("1115"), styled.div`
  margin: 58px 30px 18px 30px;
`);
const PlaceholderCardWrapper = stryMutAct_9fa48("1116") ? styled.div`` : (stryCov_9fa48("1116"), styled.div`
  display: flex;
  justify-content: center;
  margin-top: 35px;

  > * {
    margin-right: 25px;
  }
`);
const PlaceholderCard = stryMutAct_9fa48("1117") ? styled(Link)`` : (stryCov_9fa48("1117"), styled(Link)`
  height: 60px;
  width: 200px;
  border-radius: 5px;
  text-decoration: none;
  display: inline-block;
  background: ${stryMutAct_9fa48("1118") ? () => undefined : (stryCov_9fa48("1118"), ({
  theme
}) => theme.menuPage.placeholderCard)};

  > * {
    margin-left: 15px;
    margin-top: 5px;
  }

  svg {
    margin-top: 5px;
  }
`);
export default stryMutAct_9fa48("1119") ? {} : (stryCov_9fa48("1119"), {
  Page,
  Menu,
  Content,
  Placeholder,
  PlaceholderText,
  PlaceholderCardWrapper,
  PlaceholderCard
});