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

import styled, { css } from 'styled-components';
import ComponentInput from 'core/components/Form/Input';
import SelectComponent from 'core/components/Form/Select';
import Text from 'core/components/Text';
import ButtonIconRoundedComponent from 'core/components/Button/ButtonRounded';
import { baseFontSize } from 'core/components/Text/constants';
import { fadeIn } from 'core/assets/style/animate';
const Content = stryMutAct_9fa48("5846") ? styled.div`` : (stryCov_9fa48("5846"), styled.div`
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
const Form = stryMutAct_9fa48("5847") ? styled.form`` : (stryCov_9fa48("5847"), styled.form`
  width: 269px;

  > :first-child {
    margin-bottom: 20px;
  }
`);
const Input = stryMutAct_9fa48("5848") ? styled(ComponentInput)`` : (stryCov_9fa48("5848"), styled(ComponentInput)`
  margin-bottom: 20px;
`);
const Select = stryMutAct_9fa48("5849") ? styled(SelectComponent.Single)`` : (stryCov_9fa48("5849"), styled(SelectComponent.Single)`
  margin-bottom: 20px;
  width: 271px;
`);
const OptionText = stryMutAct_9fa48("5850") ? styled(Text)`` : (stryCov_9fa48("5850"), styled(Text)`
  padding: 15px 0;
`);
const ButtonGroup = stryMutAct_9fa48("5851") ? styled.div`` : (stryCov_9fa48("5851"), styled.div`
  display: flex;
  padding-bottom: 15px;

  button {
    padding-right: 20px;
  }
`);
interface ButtonIconProps {
  isActive: boolean;
}
const ButtonIconRounded = stryMutAct_9fa48("5852") ? styled(ButtonIconRoundedComponent)`` : (stryCov_9fa48("5852"), styled(ButtonIconRoundedComponent)`
  height: 40px;
  padding: 15px 35px;
  margin-right: 25px;

  span {
    font-weight: normal;
    font-size: ${baseFontSize.H6};
    margin-right: 10px;
  }

  ${stryMutAct_9fa48("5853") ? () => undefined : (stryCov_9fa48("5853"), ({
  isActive
}: ButtonIconProps) => stryMutAct_9fa48("5856") ? isActive || css`
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
    ` : stryMutAct_9fa48("5855") ? false : stryMutAct_9fa48("5854") ? true : (stryCov_9fa48("5854", "5855", "5856"), isActive && (stryMutAct_9fa48("5857") ? css`` : (stryCov_9fa48("5857"), css`
      background-color: ${stryMutAct_9fa48("5858") ? () => undefined : (stryCov_9fa48("5858"), ({
  theme
}) => theme.radio.button.checked.background)};
      span {
        color: ${stryMutAct_9fa48("5859") ? () => undefined : (stryCov_9fa48("5859"), ({
  theme
}) => theme.radio.button.checked.color)};
      }
      i {
        color: ${stryMutAct_9fa48("5860") ? () => undefined : (stryCov_9fa48("5860"), ({
  theme
}) => theme.radio.button.checked.color)};
      }
    `))))};
`);
type FormContertProps = {
  showForm: boolean;
};
const FormContent = stryMutAct_9fa48("5861") ? styled.div<FormContertProps>`` : (stryCov_9fa48("5861"), styled.div<FormContertProps>`
  display: ${stryMutAct_9fa48("5862") ? () => undefined : (stryCov_9fa48("5862"), ({
  showForm
}) => showForm ? stryMutAct_9fa48("5863") ? "" : (stryCov_9fa48("5863"), 'block') : stryMutAct_9fa48("5864") ? "" : (stryCov_9fa48("5864"), 'none'))};
`);
const Title = stryMutAct_9fa48("5865") ? styled(Text)`` : (stryCov_9fa48("5865"), styled(Text)`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  > :last-child {
    margin-left: 10px;
  }
`);
const Info = stryMutAct_9fa48("5866") ? styled(Text)`` : (stryCov_9fa48("5866"), styled(Text)`
  margin-bottom: 20px;
`);
const Link = stryMutAct_9fa48("5867") ? styled.a`` : (stryCov_9fa48("5867"), styled.a`
  text-decoration: underline;
  color: ${stryMutAct_9fa48("5868") ? () => undefined : (stryCov_9fa48("5868"), ({
  theme
}) => theme.popover.link.color)};
  text-decoration-color: ${stryMutAct_9fa48("5869") ? () => undefined : (stryCov_9fa48("5869"), ({
  theme
}) => theme.popover.link.color)};
  :hover {
    text-decoration: underline;
    text-decoration-color: ${stryMutAct_9fa48("5870") ? () => undefined : (stryCov_9fa48("5870"), ({
  theme
}) => theme.popover.link.color)};
  }
`);
const Placeholder = stryMutAct_9fa48("5871") ? styled(Text)`` : (stryCov_9fa48("5871"), styled(Text)`
  pointer-events: none;
  margin-left: 47px;
  opacity: 60%;
  overflow: hidden;
  position: absolute;
  top: 21px
`);
const Wrapper = stryMutAct_9fa48("5872") ? styled.div`` : (stryCov_9fa48("5872"), styled.div`
  position: relative;
  padding-bottom: 10px;
`);
export default stryMutAct_9fa48("5873") ? {} : (stryCov_9fa48("5873"), {
  Form,
  Content,
  Input,
  Select,
  OptionText,
  ButtonGroup,
  FormContent,
  ButtonIconRounded,
  Title,
  Info,
  Link,
  Placeholder,
  Wrapper
});