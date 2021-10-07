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

import { AbilityBuilder, Ability } from '@casl/ability';
import forEach from 'lodash/forEach';
import { getPermissions, isRoot } from 'core/utils/auth';
export type Actions = 'read' | 'write';
export type Subjects = 'maintenance' | 'deploy' | 'circles' | 'modules';
type AppAbility = Ability<[Actions, Subjects]>;
export const actions: Actions[] = stryMutAct_9fa48("1992") ? [] : (stryCov_9fa48("1992"), [stryMutAct_9fa48("1993") ? "" : (stryCov_9fa48("1993"), 'write'), stryMutAct_9fa48("1994") ? "" : (stryCov_9fa48("1994"), 'read')]);
export const subjects: Subjects[] = stryMutAct_9fa48("1995") ? [] : (stryCov_9fa48("1995"), [stryMutAct_9fa48("1996") ? "" : (stryCov_9fa48("1996"), 'modules'), stryMutAct_9fa48("1997") ? "" : (stryCov_9fa48("1997"), 'circles'), stryMutAct_9fa48("1998") ? "" : (stryCov_9fa48("1998"), 'deploy'), stryMutAct_9fa48("1999") ? "" : (stryCov_9fa48("1999"), 'maintenance')]);
const {
  build
} = new AbilityBuilder<AppAbility>();
const ability = build();

const setUserAbilities = () => {
  if (stryMutAct_9fa48("2000")) {
    {}
  } else {
    stryCov_9fa48("2000");
    const permissions = getPermissions();
    const {
      can,
      rules
    } = new AbilityBuilder<AppAbility>();

    if (stryMutAct_9fa48("2002") ? false : stryMutAct_9fa48("2001") ? true : (stryCov_9fa48("2001", "2002"), isRoot())) {
      if (stryMutAct_9fa48("2003")) {
        {}
      } else {
        stryCov_9fa48("2003");
        can(('root' as Actions), ('root' as Subjects));
        forEach(subjects, subject => {
          if (stryMutAct_9fa48("2004")) {
            {}
          } else {
            stryCov_9fa48("2004");
            forEach(actions, action => {
              if (stryMutAct_9fa48("2005")) {
                {}
              } else {
                stryCov_9fa48("2005");
                const act = (action as Actions);
                const sbj = (subject as Subjects);
                can(act, sbj);
              }
            });
          }
        });
      }
    } else {
      if (stryMutAct_9fa48("2006")) {
        {}
      } else {
        stryCov_9fa48("2006");
        forEach(permissions, (role: string) => {
          if (stryMutAct_9fa48("2007")) {
            {}
          } else {
            stryCov_9fa48("2007");
            const [sub, act = stryMutAct_9fa48("2008") ? "" : (stryCov_9fa48("2008"), 'write')] = role.split(stryMutAct_9fa48("2009") ? "" : (stryCov_9fa48("2009"), '_'));
            const subject = (sub as Subjects);
            const action = (act as Actions);
            can(action, subject);
          }
        });
      }
    }

    ability.update(rules);
  }
};

export { ability, setUserAbilities };