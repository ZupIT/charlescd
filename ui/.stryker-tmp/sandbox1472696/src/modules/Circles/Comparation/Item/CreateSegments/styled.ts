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
import ButtonComponentDefault from 'core/components/Button/ButtonDefault';
import ButtonComponentRounded from 'core/components/Button/ButtonRounded';
import { baseFontSize } from 'core/components/Text/constants';
import { Input as InputComponent } from 'core/components/Form';
import Text from 'core/components/Text';
import LayerComponent from 'core/components/Layer';
import PopoverComponent, { Props as PopoverProps } from 'core/components/Popover';
import NumberInput from 'core/components/Form/Number';
interface ButtonIconProps {
  isActive: boolean;
}
interface ButtonDefaultProps {
  isValid: boolean;
}
interface SliderValueProps {
  valueIsValid: boolean;
}
const HelpText = stryMutAct_9fa48("2810") ? styled(Text)`` : (stryCov_9fa48("2810"), styled(Text)`
  margin-top: 20px;
  margin-bottom: 10px;
`);
const Actions = stryMutAct_9fa48("2811") ? styled.div`` : (stryCov_9fa48("2811"), styled.div`
  display: flex;
`);
const ButtonIconRounded = stryMutAct_9fa48("2812") ? styled(ButtonComponentRounded)`` : (stryCov_9fa48("2812"), styled(ButtonComponentRounded)`
  height: 40px;
  padding: 13px 25px;
  margin-right: 15px;

  span {
    font-weight: bold;
    font-size: ${baseFontSize.H6};
  }

  ${stryMutAct_9fa48("2813") ? () => undefined : (stryCov_9fa48("2813"), ({
  isActive
}: ButtonIconProps) => stryMutAct_9fa48("2816") ? isActive || css`
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
    ` : stryMutAct_9fa48("2815") ? false : stryMutAct_9fa48("2814") ? true : (stryCov_9fa48("2814", "2815", "2816"), isActive && (stryMutAct_9fa48("2817") ? css`` : (stryCov_9fa48("2817"), css`
      background-color: ${stryMutAct_9fa48("2818") ? () => undefined : (stryCov_9fa48("2818"), ({
  theme
}) => theme.radio.button.checked.background)};
      span {
        color: ${stryMutAct_9fa48("2819") ? () => undefined : (stryCov_9fa48("2819"), ({
  theme
}) => theme.radio.button.checked.color)};
      }
      i {
        color: ${stryMutAct_9fa48("2820") ? () => undefined : (stryCov_9fa48("2820"), ({
  theme
}) => theme.radio.button.checked.color)};
      }
    `))))};
`);
const Input = stryMutAct_9fa48("2821") ? styled(InputComponent)`` : (stryCov_9fa48("2821"), styled(InputComponent)`
  width: 180px;
`);
const ButtonDefault = stryMutAct_9fa48("2822") ? styled(ButtonComponentDefault)<ButtonDefaultProps>`` : (stryCov_9fa48("2822"), styled(ButtonComponentDefault)<ButtonDefaultProps>`
  height: 30px;
  background-color: ${({
  theme,
  isValid
}) => {
  if (stryMutAct_9fa48("2823")) {
    {}
  } else {
    stryCov_9fa48("2823");
    const {
      saveButton
    } = theme.circleSegmentation.importCSV;
    return isValid ? saveButton.valid.background : saveButton.invalid.background;
  }
}};
`);
const Content = stryMutAct_9fa48("2824") ? styled.div`` : (stryCov_9fa48("2824"), styled.div`
  margin-top: 40px;
`);
const InputWrapper = stryMutAct_9fa48("2825") ? styled.div`` : (stryCov_9fa48("2825"), styled.div`
  margin: 30px 0 40px;
`);
const Layer = stryMutAct_9fa48("2826") ? styled(LayerComponent)`` : (stryCov_9fa48("2826"), styled(LayerComponent)`
  margin-left: 40px;
`);
const FieldPopover = stryMutAct_9fa48("2827") ? styled.div`` : (stryCov_9fa48("2827"), styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`);
const Popover = stryMutAct_9fa48("2828") ? styled(PopoverComponent)<PopoverProps>`` : (stryCov_9fa48("2828"), styled(PopoverComponent)<PopoverProps>`
  margin-left: 10px;
`);
const SliderContainer = stryMutAct_9fa48("2829") ? styled.div`` : (stryCov_9fa48("2829"), styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`);
const SliderInputContainer = stryMutAct_9fa48("2830") ? styled.div`` : (stryCov_9fa48("2830"), styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 20px;
  width: 80%;
`);
const Slider = stryMutAct_9fa48("2831") ? styled.input`` : (stryCov_9fa48("2831"), styled.input`
  height: 2px;
  width: 70%;
  -webkit-appearance: none;
  background: ${stryMutAct_9fa48("2832") ? () => undefined : (stryCov_9fa48("2832"), ({
  theme
}) => theme.slider.backgroundColor)};
  outline: none;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;

  ::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    border-radius: 50%;
    width: 15px;
    height: 15px;
    background: ${stryMutAct_9fa48("2833") ? () => undefined : (stryCov_9fa48("2833"), ({
  theme
}) => theme.slider.thumbColor)};
    cursor: pointer;
  }
`);
const SliderValue = stryMutAct_9fa48("2834") ? styled(Text)<SliderValueProps>`` : (stryCov_9fa48("2834"), styled(Text)<SliderValueProps>`
  border-bottom: ${stryMutAct_9fa48("2835") ? () => undefined : (stryCov_9fa48("2835"), ({
  theme
}) => stryMutAct_9fa48("2836") ? `` : (stryCov_9fa48("2836"), `1px solid ${theme.slider.valueBorderColor}`))};
  padding-bottom: 3px;
  width: 40px;
  text-align: center;
  color: ${stryMutAct_9fa48("2837") ? () => undefined : (stryCov_9fa48("2837"), ({
  valueIsValid,
  theme
}) => valueIsValid ? theme.slider.valueColor.active : theme.slider.valueColor.inactive)};
`);
const SliderNumberInput = stryMutAct_9fa48("2838") ? styled(NumberInput)`` : (stryCov_9fa48("2838"), styled(NumberInput)`
  width: 50px;
  display: flex;
  align-items: center;

  > input {
    position: relative;
  }
`);
export default stryMutAct_9fa48("2839") ? {} : (stryCov_9fa48("2839"), {
  HelpText,
  Layer,
  Actions,
  Input,
  ButtonDefault,
  Content,
  InputWrapper,
  ButtonIconRounded,
  FieldPopover,
  Popover,
  Slider,
  SliderContainer,
  SliderInputContainer,
  SliderValue,
  SliderNumberInput
});