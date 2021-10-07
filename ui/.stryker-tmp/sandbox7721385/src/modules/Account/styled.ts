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
import Page from 'core/components/Page';
import ComponentLayer from 'core/components/Layer';
import ComponentContentIcon from 'core/components/ContentIcon';
import Text from 'core/components/Text';
import FormComponent from 'core/components/Form';
import { slideInLeft, fadeIn } from 'core/assets/style/animate';
import CheckPass from 'core/components/CheckPassword';
import ModalDefault from 'core/components/Modal/ModalDefault';
const Wrapper = stryMutAct_9fa48("2605") ? styled.div`` : (stryCov_9fa48("2605"), styled.div`
  animation: 0.2s ${slideInLeft} linear;
`);
const Scrollable = stryMutAct_9fa48("2606") ? styled(Page.Content)`` : (stryCov_9fa48("2606"), styled(Page.Content)`
  overflow: auto;
`);
const Content = stryMutAct_9fa48("2607") ? styled.div`` : (stryCov_9fa48("2607"), styled.div`
  margin-top: 15px;
  margin-left: 45px;
`);
const ContentIcon = stryMutAct_9fa48("2608") ? styled(ComponentContentIcon)`` : (stryCov_9fa48("2608"), styled(ComponentContentIcon)`
  align-items: center;
`);
const Layer = stryMutAct_9fa48("2609") ? styled(ComponentLayer)`` : (stryCov_9fa48("2609"), styled(ComponentLayer)`
  span + span {
    margin-top: 10px;
  }
`);
const Form = stryMutAct_9fa48("2610") ? styled.div`` : (stryCov_9fa48("2610"), styled.div`
  animation: 0.5s ${fadeIn} linear;
  margin-top: 51px;
  margin-left: 30px;

  :last-child {
    padding-bottom: 40px;
  }
`);
const Actions = stryMutAct_9fa48("2611") ? styled.div`` : (stryCov_9fa48("2611"), styled.div`
  margin-left: auto;
  display: flex;
  flex-direction: row;

  > :last-child {
    margin-left: 36px;
  }
`);
const Modal = stryMutAct_9fa48("2612") ? styled(ModalDefault)`` : (stryCov_9fa48("2612"), styled(ModalDefault)`
  .modal-container {
    max-height: 550px;
    padding-right: 25px;
    bottom: 100px;
  }

  .modal-content {
    overflow-y: auto;
    padding-right: 10px;
    max-height: 500px;
  }
`);
const ChangePassword = stryMutAct_9fa48("2613") ? styled.form`` : (stryCov_9fa48("2613"), styled.form`
  width: 320px;
`);
const ModalSubtitle = stryMutAct_9fa48("2614") ? styled(Text)`` : (stryCov_9fa48("2614"), styled(Text)`
  margin: 20px 0 10px;
`);
const ModalInfo = stryMutAct_9fa48("2615") ? styled(Text)`` : (stryCov_9fa48("2615"), styled(Text)`
  margin: 20px 0 10px;
  line-height: 14px;
`);
const Password = stryMutAct_9fa48("2616") ? styled(FormComponent.Password)`` : (stryCov_9fa48("2616"), styled(FormComponent.Password)`
  margin-top: 20px;
  input {
    background-color: transparent;
  }
`);
const Error = stryMutAct_9fa48("2617") ? styled(Text)`` : (stryCov_9fa48("2617"), styled(Text)`
  margin-top: 5px;
`);
const CheckPassword = stryMutAct_9fa48("2618") ? styled(CheckPass)`` : (stryCov_9fa48("2618"), styled(CheckPass)`
  margin: 20px 0;
`);
const FieldErrorWrapper = stryMutAct_9fa48("2619") ? styled.div`` : (stryCov_9fa48("2619"), styled.div`
  display: flex;
  margin-top: 2px;

  span {
    margin-left: 5px;
    margin-top: 2px;
  }
`);
const Groups = stryMutAct_9fa48("2620") ? styled.div`` : (stryCov_9fa48("2620"), styled.div`
  display: flex;
  flex-direction: column;

  > div {
    margin-top: 10px;
  }
`);
export default stryMutAct_9fa48("2621") ? {} : (stryCov_9fa48("2621"), {
  FieldErrorWrapper,
  Wrapper,
  Content,
  ContentIcon,
  Layer,
  Scrollable,
  Form,
  Actions,
  ChangePassword,
  Password,
  Modal: stryMutAct_9fa48("2622") ? {} : (stryCov_9fa48("2622"), {
    Default: Modal,
    Subtitle: ModalSubtitle,
    Info: ModalInfo
  }),
  Error,
  CheckPassword,
  Groups
});