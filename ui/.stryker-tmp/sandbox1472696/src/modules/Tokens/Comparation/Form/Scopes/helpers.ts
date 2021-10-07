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

import { Actions, Subjects } from 'core/utils/abilities';
import includes from 'lodash/includes';
import find from 'lodash/find';
import reduceRight from 'lodash/reduceRight';
export const subjectTemplate = stryMutAct_9fa48("6461") ? () => undefined : (stryCov_9fa48("6461"), (() => {
  const subjectTemplate = (subject: Subjects) => stryMutAct_9fa48("6462") ? `` : (stryCov_9fa48("6462"), `Give full access to our ${subject.toLowerCase()} API`);

  return subjectTemplate;
})());
export const actionTemplate = (action: Actions, subject: Subjects) => {
  if (stryMutAct_9fa48("6463")) {
    {}
  } else {
    stryCov_9fa48("6463");
    return (stryMutAct_9fa48("6466") ? action?.toLowerCase() !== 'write' : stryMutAct_9fa48("6465") ? false : stryMutAct_9fa48("6464") ? true : (stryCov_9fa48("6464", "6465", "6466"), (stryMutAct_9fa48("6467") ? action.toLowerCase() : (stryCov_9fa48("6467"), action?.toLowerCase())) === (stryMutAct_9fa48("6468") ? "" : (stryCov_9fa48("6468"), 'write')))) ? stryMutAct_9fa48("6469") ? `` : (stryCov_9fa48("6469"), `Access to create, update and delete ${subject.toLowerCase()}`) : stryMutAct_9fa48("6470") ? `` : (stryCov_9fa48("6470"), `Access to read all ${subject.toLowerCase()} and individually as well`);
  }
};
export const displayAction = (subject: Subjects) => {
  if (stryMutAct_9fa48("6471")) {
    {}
  } else {
    stryCov_9fa48("6471");
    const subjectsWithAction: Subjects[] = stryMutAct_9fa48("6472") ? [] : (stryCov_9fa48("6472"), [stryMutAct_9fa48("6473") ? "" : (stryCov_9fa48("6473"), 'modules'), stryMutAct_9fa48("6474") ? "" : (stryCov_9fa48("6474"), 'circles')]);
    return includes(subjectsWithAction, subject);
  }
};
export const getScopes = (permissions: string[]) => {
  if (stryMutAct_9fa48("6475")) {
    {}
  } else {
    stryCov_9fa48("6475");
    return reduceRight(stryMutAct_9fa48("6476") ? permissions.sort() : (stryCov_9fa48("6476"), permissions?.sort()), (result, permission) => {
      if (stryMutAct_9fa48("6477")) {
        {}
      } else {
        stryCov_9fa48("6477");
        const [subject, action] = stryMutAct_9fa48("6478") ? permission.split('_') : (stryCov_9fa48("6478"), permission?.split(stryMutAct_9fa48("6479") ? "" : (stryCov_9fa48("6479"), '_')));
        const found = find(result, stryMutAct_9fa48("6480") ? () => undefined : (stryCov_9fa48("6480"), r => stryMutAct_9fa48("6483") ? r.subject === subject || r.permission !== 'read' : stryMutAct_9fa48("6482") ? false : stryMutAct_9fa48("6481") ? true : (stryCov_9fa48("6481", "6482", "6483"), (stryMutAct_9fa48("6486") ? r.subject !== subject : stryMutAct_9fa48("6485") ? false : stryMutAct_9fa48("6484") ? true : (stryCov_9fa48("6484", "6485", "6486"), r.subject === subject)) && (stryMutAct_9fa48("6489") ? r.permission === 'read' : stryMutAct_9fa48("6488") ? false : stryMutAct_9fa48("6487") ? true : (stryCov_9fa48("6487", "6488", "6489"), r.permission !== (stryMutAct_9fa48("6490") ? "" : (stryCov_9fa48("6490"), 'read')))))));
        return found ? result : stryMutAct_9fa48("6491") ? [] : (stryCov_9fa48("6491"), [...result, stryMutAct_9fa48("6492") ? {} : (stryCov_9fa48("6492"), {
          subject,
          permission: (stryMutAct_9fa48("6495") ? action !== 'write' : stryMutAct_9fa48("6494") ? false : stryMutAct_9fa48("6493") ? true : (stryCov_9fa48("6493", "6494", "6495"), action === (stryMutAct_9fa48("6496") ? "" : (stryCov_9fa48("6496"), 'write')))) ? stryMutAct_9fa48("6497") ? "" : (stryCov_9fa48("6497"), 'All permissions') : stryMutAct_9fa48("6498") ? "" : (stryCov_9fa48("6498"), 'read')
        })]);
      }
    }, stryMutAct_9fa48("6499") ? ["Stryker was here"] : (stryCov_9fa48("6499"), []));
  }
};