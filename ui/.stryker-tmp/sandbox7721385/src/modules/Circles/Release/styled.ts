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
import Text from 'core/components/Text';
import FormComponent from 'core/components/Form';
import SelectComponent from 'core/components/Form/Select';
import IconComponent from 'core/components/Icon';
import ComponentIcon from 'core/components/Icon';
import ButtonComponentDefault from 'core/components/Button/ButtonDefault';
import { slideInRight } from 'core/assets/style/animate';
import LayerComponent from 'core/components/Layer';
const Icon = stryMutAct_9fa48("3726") ? styled(ComponentIcon)`` : (stryCov_9fa48("3726"), styled(ComponentIcon)`
  animation: ${slideInRight} 1s forwards;
`);
const Layer = stryMutAct_9fa48("3727") ? styled(LayerComponent)`` : (stryCov_9fa48("3727"), styled(LayerComponent)`
  margin-left: 40px;
`);
const Subtitle = stryMutAct_9fa48("3728") ? styled(Text)`` : (stryCov_9fa48("3728"), styled(Text)`
  margin: 20px 0 10px;
`);
const Form = stryMutAct_9fa48("3729") ? styled.form`` : (stryCov_9fa48("3729"), styled.form`
  margin-top: 40px;
`);
const Input = stryMutAct_9fa48("3730") ? styled(FormComponent.Input)`` : (stryCov_9fa48("3730"), styled(FormComponent.Input)`
  width: 190px;
  margin: 10px 0 20px;
`);
const ModuleInput = stryMutAct_9fa48("3731") ? styled(FormComponent.Input)`` : (stryCov_9fa48("3731"), styled(FormComponent.Input)`
  width: 150px;
  margin: 0 0 20px;
`);
const Trash = stryMutAct_9fa48("3732") ? styled(IconComponent)`` : (stryCov_9fa48("3732"), styled(IconComponent)`
  visibility: hidden;
`);
const WrapperTrash = stryMutAct_9fa48("3733") ? styled.div`` : (stryCov_9fa48("3733"), styled.div`
  position: absolute;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 0 5px 5px 0;
  box-sizing: border-box;
  width: 40px;
  height: 40px;
  left: -40px;
  top: 0;

  :hover ${Trash} {
    visibility: visible;
  }
`);
const moduleWrapper = stryMutAct_9fa48("3734") ? styled.div`` : (stryCov_9fa48("3734"), styled.div`
  position: relative;
  display: flex;
  width: 490px;
  margin-top: 20px;
  justify-content: space-between;

  :hover ${Trash} {
    visibility: visible;
  }
`);
const Select = stryMutAct_9fa48("3735") ? styled(SelectComponent.Single)`Stryker was here!` : (stryCov_9fa48("3735"), styled(SelectComponent.Single)``);
const SelectWrapper = stryMutAct_9fa48("3736") ? styled.div`` : (stryCov_9fa48("3736"), styled.div`
  position: relative;
  width: 150px;
`);
const SearchWrapper = stryMutAct_9fa48("3737") ? styled.div`` : (stryCov_9fa48("3737"), styled.div`
  width: 180px;
  margin-bottom: 40px;
`);
const Error = stryMutAct_9fa48("3738") ? styled(Text)`` : (stryCov_9fa48("3738"), styled(Text)`
  position: absolute;
  top: 47px;
`);
const Info = stryMutAct_9fa48("3739") ? styled(Text)`` : (stryCov_9fa48("3739"), styled(Text)`
  margin-top: 40px;
  margin-bottom: 10px;
`);
const AddModule = stryMutAct_9fa48("3740") ? styled(ButtonComponentDefault)`` : (stryCov_9fa48("3740"), styled(ButtonComponentDefault)`
  display: flex;
  background-color: transparent;
  border: 2px solid ${stryMutAct_9fa48("3741") ? () => undefined : (stryCov_9fa48("3741"), ({
  theme
}) => theme.button.default.outline.border)};
  margin-bottom: 40px;
  padding: 0 20px;
  border-radius: 4px;
  align-items: center;
  color: ${stryMutAct_9fa48("3742") ? () => undefined : (stryCov_9fa48("3742"), ({
  theme
}) => theme.button.default.outline.color)};

  > i {
    margin-right: 5px;
  }
`);
const Submit = stryMutAct_9fa48("3743") ? styled(ButtonComponentDefault)`` : (stryCov_9fa48("3743"), styled(ButtonComponentDefault)`
  width: 80px;
`);
export default stryMutAct_9fa48("3744") ? {} : (stryCov_9fa48("3744"), {
  Layer,
  Icon,
  Subtitle,
  Form,
  Input,
  Select,
  SelectWrapper,
  SearchWrapper,
  Error,
  Submit,
  Module: stryMutAct_9fa48("3745") ? {} : (stryCov_9fa48("3745"), {
    Trash: WrapperTrash,
    Icon: Trash,
    Wrapper: moduleWrapper,
    Button: AddModule,
    Info,
    Input: ModuleInput
  })
});