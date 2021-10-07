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
import ButtonComponentDefault from 'core/components/Button/ButtonDefault';
import Form from 'core/components/Form';
import Text from 'core/components/Text';
import { COLOR_BLACK_MARLIN } from 'core/assets/colors';
import LoaderMenuComponent from './Loaders';
const SearchInput = stryMutAct_9fa48("4264") ? styled(SearchInputComponent)`` : (stryCov_9fa48("4264"), styled(SearchInputComponent)`
  margin: 15px 0;
  padding: 0 16px;
`);
const ListItem = stryMutAct_9fa48("4265") ? styled(LabeledIcon)`` : (stryCov_9fa48("4265"), styled(LabeledIcon)`
  padding: 15px 0;
  cursor: pointer;
  display: flex;
`);
const Item = stryMutAct_9fa48("4266") ? styled(Text)`` : (stryCov_9fa48("4266"), styled(Text)`
  text-overflow: ellipsis;
  overflow: hidden;
  width: 240px;
`);
const Content = stryMutAct_9fa48("4267") ? styled.div`` : (stryCov_9fa48("4267"), styled.div`
  height: calc(100vh - 250px);
`);
const Actions = stryMutAct_9fa48("4268") ? styled.div`` : (stryCov_9fa48("4268"), styled.div`
  > * + * {
    margin-left: 20px;
  }
  padding: 0 16px;
`);
const Icon = stryMutAct_9fa48("4269") ? styled(IconComponent)`` : (stryCov_9fa48("4269"), styled(IconComponent)`
  cursor: pointer;
`);
interface LinkProps {
  isActive: boolean;
}
const Link = stryMutAct_9fa48("4271") ? styled(stryMutAct_9fa48("4270") ? "" : (stryCov_9fa48("4270"), 'button'))<LinkProps>`` : (stryCov_9fa48("4271"), styled(stryMutAct_9fa48("4270") ? "" : (stryCov_9fa48("4270"), 'button'))<LinkProps>`
  background: none;
  border: none;
  text-decoration: none;
  width: 100%;
  padding: 0 16px;
  background-color: ${stryMutAct_9fa48("4272") ? () => undefined : (stryCov_9fa48("4272"), ({
  isActive
}) => isActive ? COLOR_BLACK_MARLIN : stryMutAct_9fa48("4273") ? "" : (stryCov_9fa48("4273"), 'transparent'))};
`);
const Button = stryMutAct_9fa48("4274") ? styled(ButtonComponentDefault)`` : (stryCov_9fa48("4274"), styled(ButtonComponentDefault)`
  border: none;
  background-color: transparent;
  padding: 0;
  margin: 0;
  height: auto;
`);
const ModalInput = stryMutAct_9fa48("4275") ? styled(Form.Input)`` : (stryCov_9fa48("4275"), styled(Form.Input)`
  width: 315px;

  > input {
    background-color: ${stryMutAct_9fa48("4276") ? () => undefined : (stryCov_9fa48("4276"), ({
  theme
}) => theme.modal.default.background)};
  }
`);
const ModalTitle = stryMutAct_9fa48("4277") ? styled(Text)`` : (stryCov_9fa48("4277"), styled(Text)`
  margin-bottom: 20px;
`);
const ButtonModal = stryMutAct_9fa48("4278") ? styled(ButtonComponentDefault)`` : (stryCov_9fa48("4278"), styled(ButtonComponentDefault)`
  width: 90px;
  height: 40px;
  margin-top: 20px;
`);
const Loader = stryMutAct_9fa48("4279") ? styled(LoaderMenuComponent.List)`` : (stryCov_9fa48("4279"), styled(LoaderMenuComponent.List)`
  padding: 0 16px;
`);
const Empty = stryMutAct_9fa48("4280") ? styled.div`` : (stryCov_9fa48("4280"), styled.div`
  padding: 0 16px;
`);
export default stryMutAct_9fa48("4281") ? {} : (stryCov_9fa48("4281"), {
  SearchInput,
  ListItem,
  Item,
  Content,
  Actions,
  Icon,
  Link,
  Button,
  Loader,
  Empty,
  Modal: stryMutAct_9fa48("4282") ? {} : (stryCov_9fa48("4282"), {
    Input: ModalInput,
    Title: ModalTitle,
    Button: ButtonModal
  })
});