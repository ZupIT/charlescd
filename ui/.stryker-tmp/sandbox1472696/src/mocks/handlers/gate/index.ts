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

import { rest } from 'msw';
import { basePath } from 'core/providers/base';
import { TOKEN, TOKENS_LIST, TOKEN_CREATE, TOKEN_REGENERATE } from './responses';
export default stryMutAct_9fa48("2389") ? [] : (stryCov_9fa48("2389"), [rest.get(stryMutAct_9fa48("2390") ? `` : (stryCov_9fa48("2390"), `${basePath}/gate/api/v1/system-token`), (req, res, ctx) => {
  if (stryMutAct_9fa48("2391")) {
    {}
  } else {
    stryCov_9fa48("2391");
    return res(ctx.json(TOKENS_LIST));
  }
}), rest.get(stryMutAct_9fa48("2392") ? `` : (stryCov_9fa48("2392"), `${basePath}/gate/api/v1/system-token/:token`), (req, res, ctx) => {
  if (stryMutAct_9fa48("2393")) {
    {}
  } else {
    stryCov_9fa48("2393");
    return res(ctx.json(TOKEN));
  }
}), rest.post(stryMutAct_9fa48("2394") ? `` : (stryCov_9fa48("2394"), `${basePath}/gate/api/v1/system-token/:token/revoke`), (req, res, ctx) => {
  if (stryMutAct_9fa48("2395")) {
    {}
  } else {
    stryCov_9fa48("2395");
    return res(ctx.json({}));
  }
}), rest.put(stryMutAct_9fa48("2396") ? `` : (stryCov_9fa48("2396"), `${basePath}/gate/api/v1/system-token/:token/regenerate`), (req, res, ctx) => {
  if (stryMutAct_9fa48("2397")) {
    {}
  } else {
    stryCov_9fa48("2397");
    return res(ctx.json(TOKEN_REGENERATE));
  }
}), rest.post(stryMutAct_9fa48("2398") ? `` : (stryCov_9fa48("2398"), `${basePath}/gate/api/v1/system-token`), (req, res, ctx) => {
  if (stryMutAct_9fa48("2399")) {
    {}
  } else {
    stryCov_9fa48("2399");
    return res(ctx.json(TOKEN_CREATE));
  }
})]);