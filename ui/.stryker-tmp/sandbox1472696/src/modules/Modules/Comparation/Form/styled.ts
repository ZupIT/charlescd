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
import FormComponent from 'core/components/Form';
import ComponentPopover, { Props as PopoverProps } from 'core/components/Popover';
import ButtonComponentDefault from 'core/components/Button/ButtonDefault';
import IconComponent from 'core/components/Icon';
import Text, { Props as TextProps } from 'core/components/Text';
import { slideInRight } from 'core/assets/style/animate';
const Title = stryMutAct_9fa48("5268") ? styled(Text)`` : (stryCov_9fa48("5268"), styled(Text)`
  display: flex;
  align-items: center;

  > :last-child {
    margin-left: 10px;
  }
`);
interface StyledSubtitle extends TextProps {
  isEditing?: boolean;
}
const Subtitle = stryMutAct_9fa48("5269") ? styled(Text)<StyledSubtitle>`` : (stryCov_9fa48("5269"), styled(Text)<StyledSubtitle>`
  margin: 20px 0px 5px;

  ${stryMutAct_9fa48("5270") ? () => undefined : (stryCov_9fa48("5270"), ({
  isEditing
}) => stryMutAct_9fa48("5273") ? isEditing || css`
    margin-bottom: 25px;
  ` : stryMutAct_9fa48("5272") ? false : stryMutAct_9fa48("5271") ? true : (stryCov_9fa48("5271", "5272", "5273"), isEditing && (stryMutAct_9fa48("5274") ? css`` : (stryCov_9fa48("5274"), css`
    margin-bottom: 25px;
  `))))};
`);
const Options = stryMutAct_9fa48("5275") ? styled(Text)`` : (stryCov_9fa48("5275"), styled(Text)`
  margin: 16px 0px;
`);
const MinorTitle = stryMutAct_9fa48("5276") ? styled(Text)`` : (stryCov_9fa48("5276"), styled(Text)`
  margin: 10px 0px;
`);
const Content = stryMutAct_9fa48("5277") ? styled.div`` : (stryCov_9fa48("5277"), styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  margin-left: 8px;
`);
const Form = stryMutAct_9fa48("5278") ? styled.form`` : (stryCov_9fa48("5278"), styled.form`
  display: flex;
  flex-direction: column;
`);
const Number = stryMutAct_9fa48("5279") ? styled(FormComponent.Number)`` : (stryCov_9fa48("5279"), styled(FormComponent.Number)`
  width: 271px;
  margin-bottom: 12px;
`);
const Input = stryMutAct_9fa48("5280") ? styled(FormComponent.Input)`` : (stryCov_9fa48("5280"), styled(FormComponent.Input)`
  width: 271px;
  margin-bottom: 5px;
`);
const Helm = stryMutAct_9fa48("5281") ? styled.div`` : (stryCov_9fa48("5281"), styled.div`
  margin-top: 40px;
  margin-bottom: 12px;
  width: 271px;
`);
const Fields = stryMutAct_9fa48("5282") ? styled.div`` : (stryCov_9fa48("5282"), styled.div`
  margin-bottom: 12px;
  width: 271px;
`);
const FieldPopover = stryMutAct_9fa48("5283") ? styled.div`` : (stryCov_9fa48("5283"), styled.div`
  position: relative;
  width: 271px;
`);
const Popover = stryMutAct_9fa48("5284") ? styled(ComponentPopover)<PopoverProps>`` : (stryCov_9fa48("5284"), styled(ComponentPopover)<PopoverProps>`
  position: absolute;
  bottom: 1px;
  right: -25px;
`);
const Button = stryMutAct_9fa48("5285") ? styled(ButtonComponentDefault)`` : (stryCov_9fa48("5285"), styled(ButtonComponentDefault)`
  margin-top: 20px;
`);
const Icon = stryMutAct_9fa48("5286") ? styled(IconComponent)`` : (stryCov_9fa48("5286"), styled(IconComponent)`
  width: 50px;
  animation: ${slideInRight} 1s forwards;
  margin-bottom: 30px;
`);
const ComponentsColumnWrapper = stryMutAct_9fa48("5287") ? styled.div`` : (stryCov_9fa48("5287"), styled.div`
  display: flex;
  flex-direction: column;
`);
const ComponentsWrapper = stryMutAct_9fa48("5288") ? styled.div`` : (stryCov_9fa48("5288"), styled.div`
  display: flex;
  position: relative;
  margin-bottom: 0px;
  flex-direction: row;
`);
const ComponentInput = stryMutAct_9fa48("5289") ? styled(FormComponent.Input)`` : (stryCov_9fa48("5289"), styled(FormComponent.Input)`
  width: 165px;
  margin-right: 20px;
`);
const ComponentNumber = stryMutAct_9fa48("5290") ? styled(FormComponent.Number)`` : (stryCov_9fa48("5290"), styled(FormComponent.Number)`
  width: 155px;
  margin-right: 20px;
`);
const ComponentTrash = stryMutAct_9fa48("5291") ? styled(IconComponent)`` : (stryCov_9fa48("5291"), styled(IconComponent)`
  position: absolute;
  bottom: 5px;
  left: -20px;
`);
const ComponentButton = stryMutAct_9fa48("5292") ? styled(ButtonComponentDefault)`` : (stryCov_9fa48("5292"), styled(ButtonComponentDefault)`
  display: flex;
  align-items: center;
  border: 2px solid ${stryMutAct_9fa48("5293") ? () => undefined : (stryCov_9fa48("5293"), ({
  theme
}) => theme.button.default.outline.border)};
  color: ${stryMutAct_9fa48("5294") ? () => undefined : (stryCov_9fa48("5294"), ({
  theme
}) => theme.button.default.outline.color)};
  box-sizing: content-box;
  background: none;
  margin-top: 10px;
  margin-bottom: 40px;

  > i {
    margin-right: 5px;
  }
`);
const MoreOptionsButton = stryMutAct_9fa48("5295") ? styled(ButtonComponentDefault)`` : (stryCov_9fa48("5295"), styled(ButtonComponentDefault)`
  display: flex;
  align-items: center;
  border: 2px solid ${stryMutAct_9fa48("5296") ? () => undefined : (stryCov_9fa48("5296"), ({
  theme
}) => theme.button.default.outline.border)};
  color: ${stryMutAct_9fa48("5297") ? () => undefined : (stryCov_9fa48("5297"), ({
  theme
}) => theme.button.default.outline.color)};
  box-sizing: content-box;
  background: none;
  margin-bottom: 20px;

  > i {
    margin-right: 5px;
  }
`);
const AdvancedOptions = stryMutAct_9fa48("5298") ? styled.div`Stryker was here!` : (stryCov_9fa48("5298"), styled.div``);
export default stryMutAct_9fa48("5299") ? {} : (stryCov_9fa48("5299"), {
  Content,
  Title,
  MinorTitle,
  Subtitle,
  Form,
  Input,
  Number,
  FieldPopover,
  Helm,
  Fields,
  Popover,
  Icon,
  Button,
  Options,
  Components: stryMutAct_9fa48("5300") ? {} : (stryCov_9fa48("5300"), {
    Wrapper: ComponentsWrapper,
    ColumnWrapper: ComponentsColumnWrapper,
    Input: ComponentInput,
    Number: ComponentNumber,
    Button: ComponentButton,
    MoreOptionsButton: MoreOptionsButton,
    Trash: ComponentTrash,
    AdvancedOptions
  })
});