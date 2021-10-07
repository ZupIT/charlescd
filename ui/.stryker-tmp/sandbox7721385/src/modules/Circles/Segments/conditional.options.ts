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

export default stryMutAct_9fa48("3746") ? [] : (stryCov_9fa48("3746"), [stryMutAct_9fa48("3747") ? {} : (stryCov_9fa48("3747"), {
  value: stryMutAct_9fa48("3748") ? "" : (stryCov_9fa48("3748"), 'EQUAL'),
  label: stryMutAct_9fa48("3749") ? "" : (stryCov_9fa48("3749"), 'Equal')
}), stryMutAct_9fa48("3750") ? {} : (stryCov_9fa48("3750"), {
  value: stryMutAct_9fa48("3751") ? "" : (stryCov_9fa48("3751"), 'GREATER_THAN'),
  label: stryMutAct_9fa48("3752") ? "" : (stryCov_9fa48("3752"), 'Higher than')
}), stryMutAct_9fa48("3753") ? {} : (stryCov_9fa48("3753"), {
  value: stryMutAct_9fa48("3754") ? "" : (stryCov_9fa48("3754"), 'GREATER_THAN_OR_EQUAL'),
  label: stryMutAct_9fa48("3755") ? "" : (stryCov_9fa48("3755"), 'Higher or equal to')
}), stryMutAct_9fa48("3756") ? {} : (stryCov_9fa48("3756"), {
  value: stryMutAct_9fa48("3757") ? "" : (stryCov_9fa48("3757"), 'LOWER_THAN'),
  label: stryMutAct_9fa48("3758") ? "" : (stryCov_9fa48("3758"), 'Lower than')
}), stryMutAct_9fa48("3759") ? {} : (stryCov_9fa48("3759"), {
  value: stryMutAct_9fa48("3760") ? "" : (stryCov_9fa48("3760"), 'LESS_THAN_OR_EQUAL'),
  label: stryMutAct_9fa48("3761") ? "" : (stryCov_9fa48("3761"), 'Lower or equal to')
}), stryMutAct_9fa48("3762") ? {} : (stryCov_9fa48("3762"), {
  value: stryMutAct_9fa48("3763") ? "" : (stryCov_9fa48("3763"), 'STARTS_WITH'),
  label: stryMutAct_9fa48("3764") ? "" : (stryCov_9fa48("3764"), 'Starts with')
}), stryMutAct_9fa48("3765") ? {} : (stryCov_9fa48("3765"), {
  value: stryMutAct_9fa48("3766") ? "" : (stryCov_9fa48("3766"), 'NOT_EQUAL'),
  label: stryMutAct_9fa48("3767") ? "" : (stryCov_9fa48("3767"), 'Not equal')
}), stryMutAct_9fa48("3768") ? {} : (stryCov_9fa48("3768"), {
  value: stryMutAct_9fa48("3769") ? "" : (stryCov_9fa48("3769"), 'ENDS_WITH'),
  label: stryMutAct_9fa48("3770") ? "" : (stryCov_9fa48("3770"), 'Ends with')
}), stryMutAct_9fa48("3771") ? {} : (stryCov_9fa48("3771"), {
  value: stryMutAct_9fa48("3772") ? "" : (stryCov_9fa48("3772"), 'MATCHES'),
  label: stryMutAct_9fa48("3773") ? "" : (stryCov_9fa48("3773"), 'Matches')
}), stryMutAct_9fa48("3774") ? {} : (stryCov_9fa48("3774"), {
  value: stryMutAct_9fa48("3775") ? "" : (stryCov_9fa48("3775"), 'CONTAINS'),
  label: stryMutAct_9fa48("3776") ? "" : (stryCov_9fa48("3776"), 'Contains')
})]);