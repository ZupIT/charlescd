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

export const TOKENS_LIST = stryMutAct_9fa48("2400") ? {} : (stryCov_9fa48("2400"), {
  "content": stryMutAct_9fa48("2401") ? [] : (stryCov_9fa48("2401"), [stryMutAct_9fa48("2402") ? {} : (stryCov_9fa48("2402"), {
    "id": stryMutAct_9fa48("2403") ? "" : (stryCov_9fa48("2403"), "11ad9dbf-e114-4868-a138-4dfa94745495"),
    "name": stryMutAct_9fa48("2404") ? "" : (stryCov_9fa48("2404"), "TOKEN 1"),
    "permissions": stryMutAct_9fa48("2405") ? [] : (stryCov_9fa48("2405"), [stryMutAct_9fa48("2406") ? "" : (stryCov_9fa48("2406"), "circles_read")]),
    "workspaces": stryMutAct_9fa48("2407") ? "Stryker was here!" : (stryCov_9fa48("2407"), ""),
    "allWorkspaces": stryMutAct_9fa48("2408") ? false : (stryCov_9fa48("2408"), true),
    "revoked": stryMutAct_9fa48("2409") ? true : (stryCov_9fa48("2409"), false),
    "created_at": stryMutAct_9fa48("2410") ? "" : (stryCov_9fa48("2410"), "2021-04-13T17:21:06.65322Z"),
    "revoked_at": stryMutAct_9fa48("2411") ? "Stryker was here!" : (stryCov_9fa48("2411"), ""),
    "last_used_at": stryMutAct_9fa48("2412") ? "Stryker was here!" : (stryCov_9fa48("2412"), ""),
    "author": stryMutAct_9fa48("2413") ? "" : (stryCov_9fa48("2413"), "rootqa@root")
  }), stryMutAct_9fa48("2414") ? {} : (stryCov_9fa48("2414"), {
    "id": stryMutAct_9fa48("2415") ? "" : (stryCov_9fa48("2415"), "abd6efc4-3b98-4049-8bdb-e8919c3d09f4"),
    "name": stryMutAct_9fa48("2416") ? "" : (stryCov_9fa48("2416"), "TOKEN 2"),
    "permissions": stryMutAct_9fa48("2417") ? [] : (stryCov_9fa48("2417"), [stryMutAct_9fa48("2418") ? "" : (stryCov_9fa48("2418"), "maintenance_write"), stryMutAct_9fa48("2419") ? "" : (stryCov_9fa48("2419"), "deploy_write"), stryMutAct_9fa48("2420") ? "" : (stryCov_9fa48("2420"), "circles_read"), stryMutAct_9fa48("2421") ? "" : (stryCov_9fa48("2421"), "circles_write"), stryMutAct_9fa48("2422") ? "" : (stryCov_9fa48("2422"), "modules_read")]),
    "workspaces": null,
    "allWorkspaces": stryMutAct_9fa48("2423") ? false : (stryCov_9fa48("2423"), true),
    "revoked": stryMutAct_9fa48("2424") ? true : (stryCov_9fa48("2424"), false),
    "created_at": stryMutAct_9fa48("2425") ? "" : (stryCov_9fa48("2425"), "2021-04-12T23:02:39.304307Z"),
    "revoked_at": null,
    "last_used_at": null,
    "author": stryMutAct_9fa48("2426") ? "" : (stryCov_9fa48("2426"), "charlesadmin@admin")
  })]),
  "page": 0,
  "size": 50,
  "last": stryMutAct_9fa48("2427") ? false : (stryCov_9fa48("2427"), true),
  "totalPages": 1
});
export const TOKEN = stryMutAct_9fa48("2428") ? {} : (stryCov_9fa48("2428"), {
  "id": stryMutAct_9fa48("2429") ? "" : (stryCov_9fa48("2429"), "abd6efc4-3b98-4049-8bdb-e8919c3d09f4"),
  "name": stryMutAct_9fa48("2430") ? "" : (stryCov_9fa48("2430"), "TOKEN 2"),
  "permissions": stryMutAct_9fa48("2431") ? [] : (stryCov_9fa48("2431"), [stryMutAct_9fa48("2432") ? "" : (stryCov_9fa48("2432"), "maintenance_write"), stryMutAct_9fa48("2433") ? "" : (stryCov_9fa48("2433"), "deploy_write"), stryMutAct_9fa48("2434") ? "" : (stryCov_9fa48("2434"), "circles_read"), stryMutAct_9fa48("2435") ? "" : (stryCov_9fa48("2435"), "circles_write"), stryMutAct_9fa48("2436") ? "" : (stryCov_9fa48("2436"), "modules_read")]),
  "workspaces": stryMutAct_9fa48("2437") ? "Stryker was here!" : (stryCov_9fa48("2437"), ""),
  "allWorkspaces": stryMutAct_9fa48("2438") ? false : (stryCov_9fa48("2438"), true),
  "revoked": stryMutAct_9fa48("2439") ? true : (stryCov_9fa48("2439"), false),
  "created_at": stryMutAct_9fa48("2440") ? "" : (stryCov_9fa48("2440"), "2021-04-12T23:02:39.304307Z"),
  "revoked_at": stryMutAct_9fa48("2441") ? "Stryker was here!" : (stryCov_9fa48("2441"), ""),
  "last_used_at": stryMutAct_9fa48("2442") ? "Stryker was here!" : (stryCov_9fa48("2442"), ""),
  "author": stryMutAct_9fa48("2443") ? "" : (stryCov_9fa48("2443"), "charlesadmin@admin")
});
export const TOKEN_CREATE = stryMutAct_9fa48("2444") ? {} : (stryCov_9fa48("2444"), { ...TOKEN,
  "token": stryMutAct_9fa48("2445") ? "" : (stryCov_9fa48("2445"), "afefef72305d48a8a5a95f2979af9a94")
});
export const TOKEN_REGENERATE = stryMutAct_9fa48("2446") ? {} : (stryCov_9fa48("2446"), {
  "token": stryMutAct_9fa48("2447") ? "" : (stryCov_9fa48("2447"), "88a3de885b9a477c9413c9953526fa41")
});