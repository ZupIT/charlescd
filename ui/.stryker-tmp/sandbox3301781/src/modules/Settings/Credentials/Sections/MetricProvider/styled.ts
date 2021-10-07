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
import ComponentInput from 'core/components/Form/Input';
import Text from 'core/components/Text';
import SelectComponent from 'core/components/Form/Select';
import ButtonDefault from 'core/components/Button/ButtonDefault';
import { fadeIn } from 'core/assets/style/animate';
import Switch from 'core/components/Switch';
const Content = stryMutAct_9fa48("5975") ? styled.div`` : (stryCov_9fa48("5975"), styled.div`
  display: flex;
  flex-direction: column;
  animation: 0.3s ${fadeIn} linear;
  margin-top: 10px;
  margin-left: 40px;

  > :first-child {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    > :last-child {
      margin-left: 10px;
    }
  }
`);
const Form = stryMutAct_9fa48("5976") ? styled.form`` : (stryCov_9fa48("5976"), styled.form`
  width: 269px;

  > :first-child {
    margin-bottom: 20px;
  }
`);
const Input = stryMutAct_9fa48("5977") ? styled(ComponentInput)`` : (stryCov_9fa48("5977"), styled(ComponentInput)`
  margin-bottom: 20px;
`);
const Select = stryMutAct_9fa48("5978") ? styled(SelectComponent.Single)`` : (stryCov_9fa48("5978"), styled(SelectComponent.Single)`
  margin-top: 20px;
  width: 271px;
`);
const Field = stryMutAct_9fa48("5979") ? styled.div`` : (stryCov_9fa48("5979"), styled.div`
  width: 500px;
  display: flex;
  flex-direction: row;
  align-items: center;

  > :first-child {
    width: 200px;
  }

  > * + * {
    margin-left: 10px;
  }
`);
const TestConnectionButton = stryMutAct_9fa48("5980") ? styled(ButtonDefault)`` : (stryCov_9fa48("5980"), styled(ButtonDefault)`
  margin-bottom: 30px;
  margin-top: 30px;
`);
const HealthSwitch = stryMutAct_9fa48("5981") ? styled(Switch)`` : (stryCov_9fa48("5981"), styled(Switch)`
  justify-content: start;

  i {
    width: 35px;
    height: 20px;

    ::after {
      width: 14px;
      height: 14px;
      left: ${stryMutAct_9fa48("5982") ? () => undefined : (stryCov_9fa48("5982"), ({
  active
}) => active ? stryMutAct_9fa48("5983") ? "" : (stryCov_9fa48("5983"), '5px') : stryMutAct_9fa48("5984") ? "" : (stryCov_9fa48("5984"), '1px'))};
    }

    ::before {
      width: 31px;
      height: 16px;
    }
  }

  span {
    margin-left: 5px;
    margin-right: 15px;
  }
`);
const HealthWrapper = stryMutAct_9fa48("5985") ? styled.div`` : (stryCov_9fa48("5985"), styled.div`
  margin-top: 20px;
  display: flex;
`);
const Placeholder = stryMutAct_9fa48("5986") ? styled(Text)`` : (stryCov_9fa48("5986"), styled(Text)`
  pointer-events: none;
  margin-left: 47px;
  opacity: 60%;
  overflow: hidden;
  position: absolute;
  top: 21px
`);
const Wrapper = stryMutAct_9fa48("5987") ? styled.div`` : (stryCov_9fa48("5987"), styled.div`
  position: relative;
`);
export default stryMutAct_9fa48("5988") ? {} : (stryCov_9fa48("5988"), {
  Form,
  Content,
  Input,
  Field,
  Select,
  TestConnectionButton,
  HealthWrapper,
  HealthSwitch,
  Placeholder,
  Wrapper
});