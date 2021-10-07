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
import { slideInLeft, fadeIn } from 'core/assets/style/animate';
import ButtonComponentDefault from 'core/components/Button/ButtonDefault';
import ButtonComponentRounded from 'core/components/Button/ButtonRounded';
import IconComponent from 'core/components/Icon';
import { baseFontSize } from 'core/components/Text/constants';
import { Input } from 'core/components/Form';
import ContentIconComponent from 'core/components/ContentIcon';
const Wrapper = stryMutAct_9fa48("3540") ? styled.div`` : (stryCov_9fa48("3540"), styled.div`
  animation: 0.2s ${slideInLeft} linear;
`);
const Content = stryMutAct_9fa48("3541") ? styled.div`` : (stryCov_9fa48("3541"), styled.div`
  animation: 0.5s ${fadeIn} linear;
  margin-top: 15px;
  margin-left: 45px;
`);
const Layer = stryMutAct_9fa48("3542") ? styled.div`` : (stryCov_9fa48("3542"), styled.div`
  margin-top: 40px;

  :last-child {
    padding-bottom: 85px;
  }
`);
const EditorWrapper = stryMutAct_9fa48("3543") ? styled.div`` : (stryCov_9fa48("3543"), styled.div`
  margin-bottom: 20px;
`);
const InputWrapper = stryMutAct_9fa48("3544") ? styled.div`` : (stryCov_9fa48("3544"), styled.div`
  display: flex;
  width: 470px;
  justify-content: space-between;
  margin: 10px 0;
  position: relative;
`);
const InputText = stryMutAct_9fa48("3545") ? styled(Input)`` : (stryCov_9fa48("3545"), styled(Input)`
  width: 220px;
`);
const Button = stryMutAct_9fa48("3546") ? styled(ButtonComponentDefault)`` : (stryCov_9fa48("3546"), styled(ButtonComponentDefault)`
  display: flex;
  align-items: center;
  border: 2px solid ${stryMutAct_9fa48("3547") ? () => undefined : (stryCov_9fa48("3547"), ({
  theme
}) => theme.button.default.outline.border)};
  color: ${stryMutAct_9fa48("3548") ? () => undefined : (stryCov_9fa48("3548"), ({
  theme
}) => theme.button.default.outline.color)};
  box-sizing: content-box;
  background: none;
  margin: 20px 0 40px 0;

  > i {
    margin-right: 5px;
  }
`);
const TrashIcon = stryMutAct_9fa48("3549") ? styled(IconComponent)`` : (stryCov_9fa48("3549"), styled(IconComponent)`
  position: absolute;
  bottom: 5px;
  left: -20px;
`);
const CardWrapper = stryMutAct_9fa48("3550") ? styled.div`` : (stryCov_9fa48("3550"), styled.div`
  background-color: ${stryMutAct_9fa48("3551") ? () => undefined : (stryCov_9fa48("3551"), ({
  theme
}) => theme.circleMatcher.circleCard.background)};
  display: flex;
  height: 60px;
  padding: 5.5px 0 4.5px 3.25px;
  width: 520px;
  margin: 15px 0;
`);
const CardContent = stryMutAct_9fa48("3552") ? styled.div`` : (stryCov_9fa48("3552"), styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: space-between;
  padding: 0 10px;
`);
const CardLeftLine = stryMutAct_9fa48("3553") ? styled.div`` : (stryCov_9fa48("3553"), styled.div`
  height: 100%;
  width: 1px;
  background: ${stryMutAct_9fa48("3554") ? () => undefined : (stryCov_9fa48("3554"), ({
  theme
}) => theme.circleMatcher.leftLine.background)};
`);
const ButtonOutlineRounded = stryMutAct_9fa48("3555") ? styled(ButtonComponentRounded)`` : (stryCov_9fa48("3555"), styled(ButtonComponentRounded)`
  border: 1px solid ${stryMutAct_9fa48("3556") ? () => undefined : (stryCov_9fa48("3556"), ({
  theme
}) => theme.button.default.outline.border)};
  color: ${stryMutAct_9fa48("3557") ? () => undefined : (stryCov_9fa48("3557"), ({
  theme
}) => theme.button.default.outline.color)};
  padding: 9.5px 18.5px;
  width: 62px;
  height: 30px;
  text-align: center;
  justify-content: center;

  span {
    font-size: ${baseFontSize.H6};
  }
`);
const ContentIcon = stryMutAct_9fa48("3558") ? styled(ContentIconComponent)`` : (stryCov_9fa48("3558"), styled(ContentIconComponent)`
  align-items: center;
`);
export default stryMutAct_9fa48("3559") ? {} : (stryCov_9fa48("3559"), {
  Wrapper,
  Content,
  Layer,
  InputWrapper,
  EditorWrapper,
  Button,
  TrashIcon,
  CardWrapper,
  CardContent,
  CardLeftLine,
  ButtonOutlineRounded,
  InputText,
  ContentIcon
});