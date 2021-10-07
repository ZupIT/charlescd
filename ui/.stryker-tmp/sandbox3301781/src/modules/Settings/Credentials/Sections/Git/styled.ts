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
import ButtonDefault from 'core/components/Button/ButtonDefault';
import Text from 'core/components/Text';
const Title = stryMutAct_9fa48("5740") ? styled(Text)`` : (stryCov_9fa48("5740"), styled(Text)`
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  > :last-child {
    margin-left: 10px;
  }
`);
const Subtitle = stryMutAct_9fa48("5741") ? styled(Text)`` : (stryCov_9fa48("5741"), styled(Text)`
  margin-bottom: 10px;
  margin-top: 20px;
`);
const Info = stryMutAct_9fa48("5742") ? styled(Text)`` : (stryCov_9fa48("5742"), styled(Text)`
  margin-bottom: 20px;
`);
const Link = stryMutAct_9fa48("5743") ? styled.a`` : (stryCov_9fa48("5743"), styled.a`
  text-decoration: underline;
  color: ${stryMutAct_9fa48("5744") ? () => undefined : (stryCov_9fa48("5744"), ({
  theme
}) => theme.popover.link.color)};
  text-decoration-color: ${stryMutAct_9fa48("5745") ? () => undefined : (stryCov_9fa48("5745"), ({
  theme
}) => theme.popover.link.color)};

  :hover {
    text-decoration: underline;
    text-decoration-color: ${stryMutAct_9fa48("5746") ? () => undefined : (stryCov_9fa48("5746"), ({
  theme
}) => theme.popover.link.color)};
  }
`);
const Content = stryMutAct_9fa48("5747") ? styled.div`` : (stryCov_9fa48("5747"), styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  margin-left: 40px;
`);
const Form = stryMutAct_9fa48("5748") ? styled.form`` : (stryCov_9fa48("5748"), styled.form`
  margin-top: 20px;
  width: 271px;
`);
const Fields = stryMutAct_9fa48("5749") ? styled.div`` : (stryCov_9fa48("5749"), styled.div`
  margin: 19px 0 20px 0;

  > * {
    margin-top: 19px;
  }
`);
const TestConnectionButton = stryMutAct_9fa48("5750") ? styled(ButtonDefault)`` : (stryCov_9fa48("5750"), styled(ButtonDefault)`
  margin-bottom: 30px;
`);
export default stryMutAct_9fa48("5751") ? {} : (stryCov_9fa48("5751"), {
  Content,
  Title,
  Subtitle,
  Info,
  Link,
  Form,
  Fields,
  TestConnectionButton
});