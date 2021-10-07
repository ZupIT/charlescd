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
import { COLOR_BLACK_MARLIN } from 'core/assets/colors';
import Avatar from 'core/components/Avatar';
import Text from 'core/components/Text';
import { Input } from 'core/components/Form';
interface WrapperProps {
  isOpen?: boolean;
  className?: string;
}
const Wrapper = stryMutAct_9fa48("4368") ? styled(stryMutAct_9fa48("4367") ? "" : (stryCov_9fa48("4367"), 'div'))<WrapperProps>`` : (stryCov_9fa48("4368"), styled(stryMutAct_9fa48("4367") ? "" : (stryCov_9fa48("4367"), 'div'))<WrapperProps>`
  display: ${stryMutAct_9fa48("4369") ? () => undefined : (stryCov_9fa48("4369"), ({
  isOpen
}: WrapperProps) => (stryMutAct_9fa48("4370") ? isOpen : (stryCov_9fa48("4370"), !isOpen)) ? stryMutAct_9fa48("4371") ? "" : (stryCov_9fa48("4371"), 'none') : stryMutAct_9fa48("4372") ? "" : (stryCov_9fa48("4372"), 'flex'))};
  z-index: ${stryMutAct_9fa48("4373") ? () => undefined : (stryCov_9fa48("4373"), ({
  theme
}) => theme.zIndex.OVER_3)};
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  .modal-user-content {
    padding: 0;
    width: 543px;
    height: calc(100vh - 262px);
  }
`);
const Placeholder = stryMutAct_9fa48("4374") ? styled.div`` : (stryCov_9fa48("4374"), styled.div`
  padding: 60px 135.5px 87.5px 135.5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`);
const Background = stryMutAct_9fa48("4375") ? styled.div`` : (stryCov_9fa48("4375"), styled.div`
  background: ${stryMutAct_9fa48("4376") ? () => undefined : (stryCov_9fa48("4376"), ({
  theme
}) => theme.modal.default.screen)};
  width: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${stryMutAct_9fa48("4377") ? () => undefined : (stryCov_9fa48("4377"), ({
  theme
}) => theme.zIndex.OVER_3)};
  opacity: 0.8;
`);
const Dialog = stryMutAct_9fa48("4378") ? styled.div`` : (stryCov_9fa48("4378"), styled.div`
  position: relative;
  width: auto;
  max-width: 500px;
  margin: 1.75rem auto;
  min-height: calc(100% - (1.75rem * 2));
`);
const Container = stryMutAct_9fa48("4379") ? styled.div`` : (stryCov_9fa48("4379"), styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background: ${stryMutAct_9fa48("4380") ? () => undefined : (stryCov_9fa48("4380"), ({
  theme
}) => theme.modal.default.background)};
  z-index: ${stryMutAct_9fa48("4381") ? () => undefined : (stryCov_9fa48("4381"), ({
  theme
}) => theme.zIndex.OVER_4)};
  color: ${stryMutAct_9fa48("4382") ? () => undefined : (stryCov_9fa48("4382"), ({
  theme
}) => theme.modal.default.text)};
  padding: 35px 41px 28px 40px;
  top: 15%;
  transform: translate(-50%, 0);
  text-align: left;
  opacity: 1.2;
`);
const Header = stryMutAct_9fa48("4383") ? styled.div`` : (stryCov_9fa48("4383"), styled.div`
  padding: 25px 50px 0 50px;
`);
const Content = stryMutAct_9fa48("4384") ? styled.div`` : (stryCov_9fa48("4384"), styled.div`
  overflow-y: auto;
  max-height: 100vh;
  border-top: 1px solid ${COLOR_BLACK_MARLIN};
`);
const Search = stryMutAct_9fa48("4385") ? styled(Input)`` : (stryCov_9fa48("4385"), styled(Input)`
  margin-top: 5px;
  margin-bottom: 20px;

  > input {
    background-color: transparent;
  }
`);
const Label = stryMutAct_9fa48("4386") ? styled.div`` : (stryCov_9fa48("4386"), styled.div`
  color: ${stryMutAct_9fa48("4387") ? () => undefined : (stryCov_9fa48("4387"), ({
  theme
}) => theme.input.label)};
  font-size: 14px;
  margin-top: 20px;
`);
const ItemWrapper = stryMutAct_9fa48("4388") ? styled.div`` : (stryCov_9fa48("4388"), styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 50px;
  border-bottom: 1px solid ${COLOR_BLACK_MARLIN};
  cursor: pointer;
  background: ${stryMutAct_9fa48("4389") ? () => undefined : (stryCov_9fa48("4389"), ({
  theme
}) => theme.modal.default.background)};
`);
const ItemContent = stryMutAct_9fa48("4390") ? styled.div`` : (stryCov_9fa48("4390"), styled.div`
  width: 350px;
`);
const ItemProfile = stryMutAct_9fa48("4391") ? styled.div`` : (stryCov_9fa48("4391"), styled.div`
  display: flex;
  flex-direction: row;
`);
const ItemPhoto = stryMutAct_9fa48("4392") ? styled(Avatar)`` : (stryCov_9fa48("4392"), styled(Avatar)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`);
const ItemName = stryMutAct_9fa48("4393") ? styled(Text)`` : (stryCov_9fa48("4393"), styled(Text)`
  font-size: 14px;
  font-weight: 900;
  text-overflow: ellipsis;
  overflow: hidden;
`);
const ItemEmail = stryMutAct_9fa48("4394") ? styled(Text)`` : (stryCov_9fa48("4394"), styled(Text)`
  font-weight: 300;
  text-overflow: ellipsis;
  overflow: hidden;
`);
const CloseButton = stryMutAct_9fa48("4395") ? styled.div`` : (stryCov_9fa48("4395"), styled.div`
  position: absolute;
  top: 15px;
  right: 10px;
`);
const UpdateButtonWrapper = stryMutAct_9fa48("4396") ? styled.div`` : (stryCov_9fa48("4396"), styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 50px;
  border-bottom: 1px solid ${COLOR_BLACK_MARLIN};
`);
const ItemChecked = stryMutAct_9fa48("4397") ? styled.div`Stryker was here!` : (stryCov_9fa48("4397"), styled.div``);
const Footer = stryMutAct_9fa48("4398") ? styled.div`Stryker was here!` : (stryCov_9fa48("4398"), styled.div``);
export default stryMutAct_9fa48("4399") ? {} : (stryCov_9fa48("4399"), {
  Wrapper,
  Placeholder,
  Background,
  Dialog,
  Container,
  Header,
  Content,
  Search,
  Label,
  Item: stryMutAct_9fa48("4400") ? {} : (stryCov_9fa48("4400"), {
    Wrapper: ItemWrapper,
    Content: ItemContent,
    Profile: ItemProfile,
    Photo: ItemPhoto,
    Name: ItemName,
    Email: ItemEmail,
    Checked: ItemChecked
  }),
  Button: stryMutAct_9fa48("4401") ? {} : (stryCov_9fa48("4401"), {
    Close: CloseButton,
    Update: UpdateButtonWrapper
  }),
  Footer
});