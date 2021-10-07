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
import Form from 'core/components/Form';
import ButtonComponentDefault from 'core/components/Button/ButtonDefault';
import Text from 'core/components/Text';
const LayerTitle = stryMutAct_9fa48("4629") ? styled.div`Stryker was here!` : (stryCov_9fa48("4629"), styled.div``);
const LayerUsers = stryMutAct_9fa48("4630") ? styled.div`Stryker was here!` : (stryCov_9fa48("4630"), styled.div``);
const ModalInput = stryMutAct_9fa48("4631") ? styled(Form.Input)`` : (stryCov_9fa48("4631"), styled(Form.Input)`
  width: 315px;

  > input {
    background-color: ${stryMutAct_9fa48("4632") ? () => undefined : (stryCov_9fa48("4632"), ({
  theme
}) => theme.modal.default.background)};
  }
`);
const ModalTitle = stryMutAct_9fa48("4633") ? styled(Text)`` : (stryCov_9fa48("4633"), styled(Text)`
  margin-bottom: 20px;
`);
const ButtonModal = stryMutAct_9fa48("4634") ? styled(ButtonComponentDefault)`` : (stryCov_9fa48("4634"), styled(ButtonComponentDefault)`
  width: 155px;
  padding-left: 0;
  padding-right: 0;
  margin-top: 20px;
`);
export default stryMutAct_9fa48("4635") ? {} : (stryCov_9fa48("4635"), {
  Layer: stryMutAct_9fa48("4636") ? {} : (stryCov_9fa48("4636"), {
    Title: LayerTitle,
    Users: LayerUsers
  }),
  Modal: stryMutAct_9fa48("4637") ? {} : (stryCov_9fa48("4637"), {
    Input: ModalInput,
    Title: ModalTitle,
    Button: ButtonModal
  })
});