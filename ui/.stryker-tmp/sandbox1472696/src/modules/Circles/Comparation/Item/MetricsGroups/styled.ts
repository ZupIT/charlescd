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
import ComponentIcon from 'core/components/Icon';
import ButtonComponentDefault from 'core/components/Button/ButtonDefault';
import ButtonComponentRounded from 'core/components/Button/ButtonRounded';
import SelectComponent from 'core/components/Form/Select';
import InputNumberComponent from 'core/components/Form/Number';
import Text from 'core/components/Text';
import InputComponent from 'core/components/Form/Input';
import { slideInRight } from 'core/assets/style/animate';
import LayerComponent from 'core/components/Layer';
import { baseFontSize } from 'core/components/Text/constants';
interface ButtonDefaultProps {
  isValid: boolean;
}
interface ButtonIconProps {
  isActive: boolean;
}
const Icon = stryMutAct_9fa48("3374") ? styled(ComponentIcon)`` : (stryCov_9fa48("3374"), styled(ComponentIcon)`
  animation: ${slideInRight} 1s forwards;
  margin-bottom: 20px;
  margin-top: 22px;
`);
const TrashIcon = stryMutAct_9fa48("3375") ? styled(ComponentIcon)`` : (stryCov_9fa48("3375"), styled(ComponentIcon)`
  display: flex;
  margin-bottom: 6px;
  cursor: pointer;
`);
const Layer = stryMutAct_9fa48("3376") ? styled(LayerComponent)`` : (stryCov_9fa48("3376"), styled(LayerComponent)`
  margin-top: 20px;
  margin-left: 40px;
`);
const ButtonAdd = stryMutAct_9fa48("3377") ? styled(ButtonComponentRounded)`` : (stryCov_9fa48("3377"), styled(ButtonComponentRounded)`
  margin-top: 15px;
  margin-bottom: 15px;
`);
const Input = stryMutAct_9fa48("3378") ? styled(InputComponent)`` : (stryCov_9fa48("3378"), styled(InputComponent)`
  width: 370px;
  margin: 10px 0 20px;
`);
const ButtonDefault = stryMutAct_9fa48("3379") ? styled(ButtonComponentDefault)<ButtonDefaultProps>`` : (stryCov_9fa48("3379"), styled(ButtonComponentDefault)<ButtonDefaultProps>`
  background-color: ${({
  theme,
  isValid
}) => {
  if (stryMutAct_9fa48("3380")) {
    {}
  } else {
    stryCov_9fa48("3380");
    const {
      saveButton
    } = theme.circleSegmentation.importCSV;
    return isValid ? saveButton.valid.background : saveButton.invalid.background;
  }
}};
`);
const Form = stryMutAct_9fa48("3381") ? styled.form`` : (stryCov_9fa48("3381"), styled.form`
  width: 540px;
`);
const Subtitle = stryMutAct_9fa48("3382") ? styled(Text)`` : (stryCov_9fa48("3382"), styled(Text)`
  margin: 20px 0;
`);
const Title = stryMutAct_9fa48("3383") ? styled(Text)`` : (stryCov_9fa48("3383"), styled(Text)`
  margin-top: 40px;
`);
const ThresholdSelect = stryMutAct_9fa48("3384") ? styled(SelectComponent.Single)`` : (stryCov_9fa48("3384"), styled(SelectComponent.Single)`
  width: 130px;
  margin-right: 20px;
`);
const InputNumber = stryMutAct_9fa48("3385") ? styled(InputNumberComponent)`` : (stryCov_9fa48("3385"), styled(InputNumberComponent)`
  width: 130px;
`);
const ThresholdWrapper = stryMutAct_9fa48("3386") ? styled.div`` : (stryCov_9fa48("3386"), styled.div`
  display: flex;
  margin-bottom: 20px;
`);
const Select = stryMutAct_9fa48("3387") ? styled(SelectComponent.Single)`` : (stryCov_9fa48("3387"), styled(SelectComponent.Single)`
  width: 370px;
  margin-bottom: 20px;
`);
const SelectAsync = stryMutAct_9fa48("3388") ? styled(SelectComponent.Async)`` : (stryCov_9fa48("3388"), styled(SelectComponent.Async)`
  width: 370px;
  margin-bottom: 20px;
`);
const SelectMetric = stryMutAct_9fa48("3389") ? styled(SelectComponent.Single)`` : (stryCov_9fa48("3389"), styled(SelectComponent.Single)`
  width: 380px;
  margin-bottom: 20px;
`);
const Actions = stryMutAct_9fa48("3390") ? styled.div`` : (stryCov_9fa48("3390"), styled.div`
  margin: 20px 0;
  display: flex;

  button:first-child {
    margin-right: 15px;
  }
`);
const ButtonIconRounded = stryMutAct_9fa48("3391") ? styled(ButtonComponentRounded)`` : (stryCov_9fa48("3391"), styled(ButtonComponentRounded)`
  height: 40px;
  padding: 13px 25px;

  span {
    font-weight: normal;
    font-size: ${baseFontSize.H6};
  }

  ${stryMutAct_9fa48("3392") ? () => undefined : (stryCov_9fa48("3392"), ({
  isActive
}: ButtonIconProps) => stryMutAct_9fa48("3395") ? isActive || css`
      background-color: ${({
  theme
}) => theme.radio.button.checked.background};
      span {
        color: ${({
  theme
}) => theme.radio.button.checked.color};
      }
      i {
        color: ${({
  theme
}) => theme.radio.button.checked.color};
      }
    ` : stryMutAct_9fa48("3394") ? false : stryMutAct_9fa48("3393") ? true : (stryCov_9fa48("3393", "3394", "3395"), isActive && (stryMutAct_9fa48("3396") ? css`` : (stryCov_9fa48("3396"), css`
      background-color: ${stryMutAct_9fa48("3397") ? () => undefined : (stryCov_9fa48("3397"), ({
  theme
}) => theme.radio.button.checked.background)};
      span {
        color: ${stryMutAct_9fa48("3398") ? () => undefined : (stryCov_9fa48("3398"), ({
  theme
}) => theme.radio.button.checked.color)};
      }
      i {
        color: ${stryMutAct_9fa48("3399") ? () => undefined : (stryCov_9fa48("3399"), ({
  theme
}) => theme.radio.button.checked.color)};
      }
    `))))};
`);
const AdvancedQueryWrapper = stryMutAct_9fa48("3400") ? styled.div`` : (stryCov_9fa48("3400"), styled.div`
  width: 100%;
  margin: 20px 0;
`);
const ModalInput = stryMutAct_9fa48("3401") ? styled(InputComponent)`` : (stryCov_9fa48("3401"), styled(InputComponent)`
  width: 315px;

  > input {
    background-color: ${stryMutAct_9fa48("3402") ? () => undefined : (stryCov_9fa48("3402"), ({
  theme
}) => theme.modal.default.background)};
  }
`);
const ModalTitle = stryMutAct_9fa48("3403") ? styled(Text)`` : (stryCov_9fa48("3403"), styled(Text)`
  margin-bottom: 20px;
`);
const ButtonModal = stryMutAct_9fa48("3404") ? styled(ButtonComponentDefault)`` : (stryCov_9fa48("3404"), styled(ButtonComponentDefault)`
  width: 155px;
  padding-left: 0;
  padding-right: 0;
  margin-top: 20px;
`);
const RuleWrapper = stryMutAct_9fa48("3405") ? styled.div`` : (stryCov_9fa48("3405"), styled.div`
  max-width: 80%;
`);
const FieldErrorWrapper = stryMutAct_9fa48("3406") ? styled.div`` : (stryCov_9fa48("3406"), styled.div`
  display: flex;

  span {
    margin-left: 5px;
  }
`);
export default stryMutAct_9fa48("3407") ? {} : (stryCov_9fa48("3407"), {
  Layer,
  Icon,
  ButtonAdd,
  Input,
  ButtonDefault,
  Form,
  Subtitle,
  Title,
  ThresholdSelect,
  InputNumber,
  ThresholdWrapper,
  Select,
  SelectMetric,
  Actions,
  ButtonIconRounded,
  AdvancedQueryWrapper,
  Modal: stryMutAct_9fa48("3408") ? {} : (stryCov_9fa48("3408"), {
    Input: ModalInput,
    Title: ModalTitle,
    Button: ButtonModal
  }),
  TrashIcon,
  RuleWrapper,
  FieldErrorWrapper,
  SelectAsync
});