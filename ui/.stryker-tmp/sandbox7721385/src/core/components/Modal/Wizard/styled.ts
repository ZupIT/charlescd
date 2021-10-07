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
import Text from 'core/components/Text';
import ButtonComponent from 'core/components/Button/ButtonRounded';
import IconComponent from 'core/components/Icon';
import SwitchComponet from 'core/components/Switch';
const Icon = stryMutAct_9fa48("1003") ? styled(IconComponent)`Stryker was here!` : (stryCov_9fa48("1003"), styled(IconComponent)``);
interface WrapperProps {
  className?: string;
}
const Wrapper = stryMutAct_9fa48("1005") ? styled(stryMutAct_9fa48("1004") ? "" : (stryCov_9fa48("1004"), 'div'))<WrapperProps>`` : (stryCov_9fa48("1005"), styled(stryMutAct_9fa48("1004") ? "" : (stryCov_9fa48("1004"), 'div'))<WrapperProps>`
  display: flex;
  z-index: ${stryMutAct_9fa48("1006") ? () => undefined : (stryCov_9fa48("1006"), ({
  theme
}) => theme.zIndex.OVER_3)};
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`);
const Button = stryMutAct_9fa48("1007") ? styled(ButtonComponent)`` : (stryCov_9fa48("1007"), styled(ButtonComponent)`
  display: flex;
  margin-top: 30px;
`);
const Message = stryMutAct_9fa48("1008") ? styled.div`` : (stryCov_9fa48("1008"), styled.div`
  font-size: 15px;
`);
const Background = stryMutAct_9fa48("1009") ? styled.div`` : (stryCov_9fa48("1009"), styled.div`
  background: ${stryMutAct_9fa48("1010") ? () => undefined : (stryCov_9fa48("1010"), ({
  theme
}) => theme.modal.wizard.screen)};
  width: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${stryMutAct_9fa48("1011") ? () => undefined : (stryCov_9fa48("1011"), ({
  theme
}) => theme.zIndex.OVER_3)};
  opacity: 0.8;
`);
const Dialog = stryMutAct_9fa48("1012") ? styled.div`` : (stryCov_9fa48("1012"), styled.div`
  position: relative;
  width: auto;
  margin: 1.75rem auto;
  min-height: calc(100% - (1.75rem * 2));
`);
const Container = stryMutAct_9fa48("1013") ? styled.div`` : (stryCov_9fa48("1013"), styled.div`
  position: fixed;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  z-index: ${stryMutAct_9fa48("1014") ? () => undefined : (stryCov_9fa48("1014"), ({
  theme
}) => theme.zIndex.OVER_4)};
  padding: 26px 21px 26px 30px;
  top: 15%;
  transform: translate(-50%, 0);
  text-align: left;
  width: 784px;
`);
const SideMenu = stryMutAct_9fa48("1015") ? styled.div`` : (stryCov_9fa48("1015"), styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background: ${stryMutAct_9fa48("1016") ? () => undefined : (stryCov_9fa48("1016"), ({
  theme
}) => theme.modal.wizard.background.menu)};
  z-index: ${stryMutAct_9fa48("1017") ? () => undefined : (stryCov_9fa48("1017"), ({
  theme
}) => theme.zIndex.OVER_4)};
  padding: 26px 21px 26px 30px;
  text-align: left;
  width: 30%;
`);
const Content = stryMutAct_9fa48("1018") ? styled.div`` : (stryCov_9fa48("1018"), styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  z-index: ${stryMutAct_9fa48("1019") ? () => undefined : (stryCov_9fa48("1019"), ({
  theme
}) => theme.zIndex.OVER_4)};
  width: 70%;
`);
const Info = stryMutAct_9fa48("1020") ? styled.div`` : (stryCov_9fa48("1020"), styled.div`
  height: 32%;
  position: relative;
  display: flex;
  flex-direction: column;
  background: ${stryMutAct_9fa48("1021") ? () => undefined : (stryCov_9fa48("1021"), ({
  theme
}) => theme.modal.wizard.background.info)};
  color: ${stryMutAct_9fa48("1022") ? () => undefined : (stryCov_9fa48("1022"), ({
  theme
}) => theme.modal.wizard.text.active)};
  padding: 28px 52px 0 21px;
  text-align: left;
`);
const Title = stryMutAct_9fa48("1023") ? styled(Text)`Stryker was here!` : (stryCov_9fa48("1023"), styled(Text)``);
const Subtitle = stryMutAct_9fa48("1024") ? styled(Text)`` : (stryCov_9fa48("1024"), styled(Text)`
  margin-top: 15px;
`);
interface ImageBackgroundProps {
  backgroundColor: string;
}
const ImageBackground = stryMutAct_9fa48("1025") ? styled.div<ImageBackgroundProps>`` : (stryCov_9fa48("1025"), styled.div<ImageBackgroundProps>`
  height: 68%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${stryMutAct_9fa48("1026") ? () => undefined : (stryCov_9fa48("1026"), ({
  theme,
  backgroundColor
}) => theme.modal.wizard.background[backgroundColor])};
`);
interface ItemProps {
  status: 'read' | 'unread' | 'active';
}
const ItemText = stryMutAct_9fa48("1027") ? styled(Text)<ItemProps>`` : (stryCov_9fa48("1027"), styled(Text)<ItemProps>`
  color: ${stryMutAct_9fa48("1028") ? () => undefined : (stryCov_9fa48("1028"), ({
  status,
  theme
}) => (stryMutAct_9fa48("1031") ? status !== 'unread' : stryMutAct_9fa48("1030") ? false : stryMutAct_9fa48("1029") ? true : (stryCov_9fa48("1029", "1030", "1031"), status === (stryMutAct_9fa48("1032") ? "" : (stryCov_9fa48("1032"), 'unread')))) ? theme.modal.wizard.text.inactive : theme.modal.wizard.text.active)};
  margin-left: ${stryMutAct_9fa48("1033") ? () => undefined : (stryCov_9fa48("1033"), ({
  status
}) => (stryMutAct_9fa48("1036") ? status !== 'active' : stryMutAct_9fa48("1035") ? false : stryMutAct_9fa48("1034") ? true : (stryCov_9fa48("1034", "1035", "1036"), status === (stryMutAct_9fa48("1037") ? "" : (stryCov_9fa48("1037"), 'active')))) ? stryMutAct_9fa48("1038") ? "" : (stryCov_9fa48("1038"), '9px') : stryMutAct_9fa48("1039") ? "" : (stryCov_9fa48("1039"), '0'))};
`);
const Item = stryMutAct_9fa48("1040") ? styled.div`` : (stryCov_9fa48("1040"), styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: row;
`);
const ActiveItem = stryMutAct_9fa48("1041") ? styled.div<ItemProps>`` : (stryCov_9fa48("1041"), styled.div<ItemProps>`
  display: ${stryMutAct_9fa48("1042") ? () => undefined : (stryCov_9fa48("1042"), ({
  status
}) => (stryMutAct_9fa48("1045") ? status !== 'active' : stryMutAct_9fa48("1044") ? false : stryMutAct_9fa48("1043") ? true : (stryCov_9fa48("1043", "1044", "1045"), status === (stryMutAct_9fa48("1046") ? "" : (stryCov_9fa48("1046"), 'active')))) ? stryMutAct_9fa48("1047") ? "" : (stryCov_9fa48("1047"), 'flex') : stryMutAct_9fa48("1048") ? "" : (stryCov_9fa48("1048"), 'none'))};
  width: 1px;
  height: 15px;
  box-sizing: border-box;
  border-radius: 1.5px;
  background: ${stryMutAct_9fa48("1049") ? () => undefined : (stryCov_9fa48("1049"), ({
  theme
}) => theme.modal.wizard.text.active)};
`);
const Switch = stryMutAct_9fa48("1050") ? styled(SwitchComponet)`` : (stryCov_9fa48("1050"), styled(SwitchComponet)`
  margin-top: 26px;
  justify-content: normal;

  > :last-child {
    margin-left: 10px;
  }
`);
export default stryMutAct_9fa48("1051") ? {} : (stryCov_9fa48("1051"), {
  Wrapper,
  Background,
  Dialog,
  Container,
  SideMenu,
  Button,
  Message,
  Item: stryMutAct_9fa48("1052") ? {} : (stryCov_9fa48("1052"), {
    Text: ItemText,
    Wrapper: Item,
    Active: ActiveItem
  }),
  Info,
  Content: stryMutAct_9fa48("1053") ? {} : (stryCov_9fa48("1053"), {
    Wrapper: Content,
    Background: ImageBackground,
    Title,
    Subtitle,
    Icon
  }),
  Switch
});