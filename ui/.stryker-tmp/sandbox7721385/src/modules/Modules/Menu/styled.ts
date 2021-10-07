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

import styled, { css } from 'styled-components';
import LabeledIcon from 'core/components/LabeledIcon';
import SearchInputComponent from 'core/components/Form/SearchInput';
import ButtonComponentDefault from 'core/components/Button/ButtonDefault';
import Form from 'core/components/Form';
import Text from 'core/components/Text';
import { COLOR_BLACK_MARLIN } from 'core/assets/colors';
import LoaderMenuComponent from './Loaders';
const SearchInput = stryMutAct_9fa48("5353") ? styled(SearchInputComponent)`` : (stryCov_9fa48("5353"), styled(SearchInputComponent)`
  margin: 15px 0;
  padding: 0 16px;
`);
const List = stryMutAct_9fa48("5354") ? styled.div`` : (stryCov_9fa48("5354"), styled.div`
  display: flex;
  flex-direction: column;
  margin: 0;
`);
const ListItem = stryMutAct_9fa48("5355") ? styled(LabeledIcon)`` : (stryCov_9fa48("5355"), styled(LabeledIcon)`
  padding: 15px 0;
  cursor: pointer;
  display: flex;
`);
const Content = stryMutAct_9fa48("5356") ? styled.div`` : (stryCov_9fa48("5356"), styled.div`
  height: calc(100vh - 250px);
`);
const Actions = stryMutAct_9fa48("5357") ? styled.div`` : (stryCov_9fa48("5357"), styled.div`
  > * + * {
    margin-left: 20px;
  }

  padding: 0 16px;
`);
interface LinkProps {
  isActive: boolean;
}
const Link = stryMutAct_9fa48("5359") ? styled(stryMutAct_9fa48("5358") ? "" : (stryCov_9fa48("5358"), 'button'))<LinkProps>`` : (stryCov_9fa48("5359"), styled(stryMutAct_9fa48("5358") ? "" : (stryCov_9fa48("5358"), 'button'))<LinkProps>`
  background: none;
  border: none;
  text-decoration: none;
  width: 100%;
  padding: 0 16px;
  background-color: ${stryMutAct_9fa48("5360") ? () => undefined : (stryCov_9fa48("5360"), ({
  isActive
}) => isActive ? COLOR_BLACK_MARLIN : stryMutAct_9fa48("5361") ? "" : (stryCov_9fa48("5361"), 'transparent'))};
`);
const Button = stryMutAct_9fa48("5362") ? styled(ButtonComponentDefault)`` : (stryCov_9fa48("5362"), styled(ButtonComponentDefault)`
  border: none;
  background-color: transparent;
  padding: 0;
  margin: 0;
  height: auto;

  ${stryMutAct_9fa48("5363") ? () => undefined : (stryCov_9fa48("5363"), ({
  isDisabled
}) => stryMutAct_9fa48("5366") ? isDisabled || css`
      cursor: default;
      opacity: 0.3;

      * {
        cursor: default;
      }
    ` : stryMutAct_9fa48("5365") ? false : stryMutAct_9fa48("5364") ? true : (stryCov_9fa48("5364", "5365", "5366"), isDisabled && (stryMutAct_9fa48("5367") ? css`` : (stryCov_9fa48("5367"), css`
      cursor: default;
      opacity: 0.3;

      * {
        cursor: default;
      }
    `))))}
`);
const ModalInput = stryMutAct_9fa48("5368") ? styled(Form.Input)`` : (stryCov_9fa48("5368"), styled(Form.Input)`
  width: 315px;

  > input {
    background-color: ${stryMutAct_9fa48("5369") ? () => undefined : (stryCov_9fa48("5369"), ({
  theme
}) => theme.modal.default.background)};
  }
`);
const ModalTitle = stryMutAct_9fa48("5370") ? styled(Text)`` : (stryCov_9fa48("5370"), styled(Text)`
  margin-bottom: 20px;
`);
const ButtonModal = stryMutAct_9fa48("5371") ? styled(ButtonComponentDefault)`` : (stryCov_9fa48("5371"), styled(ButtonComponentDefault)`
  height: 40px;
  margin-top: 20px;
`);
const Loader = stryMutAct_9fa48("5372") ? styled(LoaderMenuComponent.List)`` : (stryCov_9fa48("5372"), styled(LoaderMenuComponent.List)`
  margin-left: 16px;
`);
const Empty = stryMutAct_9fa48("5373") ? styled.div`` : (stryCov_9fa48("5373"), styled.div`
  padding: 0 16px;
`);
export default stryMutAct_9fa48("5374") ? {} : (stryCov_9fa48("5374"), {
  SearchInput,
  List,
  ListItem,
  Content,
  Actions,
  Loader,
  Link,
  Empty,
  Button,
  Modal: stryMutAct_9fa48("5375") ? {} : (stryCov_9fa48("5375"), {
    Input: ModalInput,
    Title: ModalTitle,
    Button: ButtonModal
  })
});