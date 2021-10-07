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
import ButtonRounded from 'core/components/Button/ButtonRounded';
import Avatar from 'core/components/Avatar';
const LayerTitle = stryMutAct_9fa48("4338") ? styled.div`` : (stryCov_9fa48("4338"), styled.div`
  margin-top: 50px;
`);
const LayerUsers = stryMutAct_9fa48("4339") ? styled.div`` : (stryCov_9fa48("4339"), styled.div`
  margin-top: 40px;
`);
const ButtonAdd = stryMutAct_9fa48("4340") ? styled(ButtonRounded)`` : (stryCov_9fa48("4340"), styled(ButtonRounded)`
  margin-top: 10px;
  margin-bottom: 5px;
`);
const UserList = stryMutAct_9fa48("4341") ? styled.div`` : (stryCov_9fa48("4341"), styled.div`
  display: flex;
  flex-direction: row;
`);
const UserAvatar = stryMutAct_9fa48("4342") ? styled.img`` : (stryCov_9fa48("4342"), styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`);
const UserAvatarNoPhoto = stryMutAct_9fa48("4343") ? styled(Avatar)`` : (stryCov_9fa48("4343"), styled(Avatar)`
  margin: 5px;
`);
const UsersCounter = stryMutAct_9fa48("4344") ? styled.div`` : (stryCov_9fa48("4344"), styled.div`
  cursor: pointer;
  margin: 5px;
  width: 100%;
  height: 100%;
  background: ${stryMutAct_9fa48("4345") ? () => undefined : (stryCov_9fa48("4345"), ({
  theme
}) => theme.avatar.counter)};
  color: ${stryMutAct_9fa48("4346") ? () => undefined : (stryCov_9fa48("4346"), ({
  theme
}) => theme.avatar.number)};
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`);
const FieldErrorWrapper = stryMutAct_9fa48("4347") ? styled.div`` : (stryCov_9fa48("4347"), styled.div`
  display: flex;
  margin-top: 5px;

  span {
    margin-top: 2px;
    margin-left: 5px;
  }
`);
export default stryMutAct_9fa48("4348") ? {} : (stryCov_9fa48("4348"), {
  FieldErrorWrapper,
  UserList,
  UserAvatar,
  ButtonAdd,
  UserAvatarNoPhoto,
  UsersCounter,
  Layer: stryMutAct_9fa48("4349") ? {} : (stryCov_9fa48("4349"), {
    Title: LayerTitle,
    Users: LayerUsers
  })
});