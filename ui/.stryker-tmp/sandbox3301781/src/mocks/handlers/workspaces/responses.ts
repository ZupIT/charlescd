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

export const WORKSPACES_LIST = stryMutAct_9fa48("2495") ? {} : (stryCov_9fa48("2495"), {
  "content": stryMutAct_9fa48("2496") ? [] : (stryCov_9fa48("2496"), [stryMutAct_9fa48("2497") ? {} : (stryCov_9fa48("2497"), {
    "id": stryMutAct_9fa48("2498") ? "" : (stryCov_9fa48("2498"), "da890485-b3a4-4ee3-96ca-290b06032af8"),
    "name": stryMutAct_9fa48("2499") ? "" : (stryCov_9fa48("2499"), "                                                Sc"),
    "status": stryMutAct_9fa48("2500") ? "" : (stryCov_9fa48("2500"), "INCOMPLETE"),
    "authorId": stryMutAct_9fa48("2501") ? "" : (stryCov_9fa48("2501"), "c7e6dafe-aa7a-4536-be1b-34eaad4c2915"),
    "gitConfiguration": stryMutAct_9fa48("2502") ? "Stryker was here!" : (stryCov_9fa48("2502"), ""),
    "registryConfiguration": stryMutAct_9fa48("2503") ? "Stryker was here!" : (stryCov_9fa48("2503"), ""),
    "cdConfiguration": stryMutAct_9fa48("2504") ? "Stryker was here!" : (stryCov_9fa48("2504"), ""),
    "circleMatcherUrl": stryMutAct_9fa48("2505") ? "Stryker was here!" : (stryCov_9fa48("2505"), ""),
    "metricConfiguration": stryMutAct_9fa48("2506") ? "Stryker was here!" : (stryCov_9fa48("2506"), ""),
    "userGroups": stryMutAct_9fa48("2507") ? ["Stryker was here"] : (stryCov_9fa48("2507"), []),
    "createdAt": stryMutAct_9fa48("2508") ? "" : (stryCov_9fa48("2508"), "2021-01-27 14:30:00")
  }), stryMutAct_9fa48("2509") ? {} : (stryCov_9fa48("2509"), {
    "id": stryMutAct_9fa48("2510") ? "" : (stryCov_9fa48("2510"), "7e41cd61-1d0a-4fca-9237-5b46705a6ed0"),
    "name": stryMutAct_9fa48("2511") ? "" : (stryCov_9fa48("2511"), "                     sdfk.jhksjdfg                "),
    "status": stryMutAct_9fa48("2512") ? "" : (stryCov_9fa48("2512"), "INCOMPLETE"),
    "authorId": stryMutAct_9fa48("2513") ? "" : (stryCov_9fa48("2513"), "c7e6dafe-aa7a-4536-be1b-34eaad4c2915"),
    "gitConfiguration": stryMutAct_9fa48("2514") ? "Stryker was here!" : (stryCov_9fa48("2514"), ""),
    "registryConfiguration": stryMutAct_9fa48("2515") ? "Stryker was here!" : (stryCov_9fa48("2515"), ""),
    "cdConfiguration": stryMutAct_9fa48("2516") ? "Stryker was here!" : (stryCov_9fa48("2516"), ""),
    "circleMatcherUrl": stryMutAct_9fa48("2517") ? "Stryker was here!" : (stryCov_9fa48("2517"), ""),
    "metricConfiguration": stryMutAct_9fa48("2518") ? "Stryker was here!" : (stryCov_9fa48("2518"), ""),
    "userGroups": stryMutAct_9fa48("2519") ? ["Stryker was here"] : (stryCov_9fa48("2519"), []),
    "createdAt": stryMutAct_9fa48("2520") ? "" : (stryCov_9fa48("2520"), "2021-01-27 14:30:58")
  }), stryMutAct_9fa48("2521") ? {} : (stryCov_9fa48("2521"), {
    "id": stryMutAct_9fa48("2522") ? "" : (stryCov_9fa48("2522"), "cfc47018-c583-4e03-8c85-208334e68974"),
    "name": stryMutAct_9fa48("2523") ? "" : (stryCov_9fa48("2523"), "12"),
    "status": stryMutAct_9fa48("2524") ? "" : (stryCov_9fa48("2524"), "INCOMPLETE"),
    "authorId": stryMutAct_9fa48("2525") ? "" : (stryCov_9fa48("2525"), "c7e6dafe-aa7a-4536-be1b-34eaad4c2915"),
    "gitConfiguration": stryMutAct_9fa48("2526") ? "Stryker was here!" : (stryCov_9fa48("2526"), ""),
    "registryConfiguration": stryMutAct_9fa48("2527") ? "Stryker was here!" : (stryCov_9fa48("2527"), ""),
    "cdConfiguration": stryMutAct_9fa48("2528") ? "Stryker was here!" : (stryCov_9fa48("2528"), ""),
    "circleMatcherUrl": stryMutAct_9fa48("2529") ? "Stryker was here!" : (stryCov_9fa48("2529"), ""),
    "metricConfiguration": stryMutAct_9fa48("2530") ? "Stryker was here!" : (stryCov_9fa48("2530"), ""),
    "userGroups": stryMutAct_9fa48("2531") ? ["Stryker was here"] : (stryCov_9fa48("2531"), []),
    "createdAt": stryMutAct_9fa48("2532") ? "" : (stryCov_9fa48("2532"), "2021-01-26 12:54:26")
  }), stryMutAct_9fa48("2533") ? {} : (stryCov_9fa48("2533"), {
    "id": stryMutAct_9fa48("2534") ? "" : (stryCov_9fa48("2534"), "7ee6241e-9443-4c39-8b47-2d5bbd610c98"),
    "name": stryMutAct_9fa48("2535") ? "" : (stryCov_9fa48("2535"), "Douglas"),
    "status": stryMutAct_9fa48("2536") ? "" : (stryCov_9fa48("2536"), "INCOMPLETE"),
    "authorId": stryMutAct_9fa48("2537") ? "" : (stryCov_9fa48("2537"), "c7e6dafe-aa7a-4536-be1b-34eaad4c2915"),
    "gitConfiguration": stryMutAct_9fa48("2538") ? "Stryker was here!" : (stryCov_9fa48("2538"), ""),
    "registryConfiguration": stryMutAct_9fa48("2539") ? "Stryker was here!" : (stryCov_9fa48("2539"), ""),
    "cdConfiguration": stryMutAct_9fa48("2540") ? "Stryker was here!" : (stryCov_9fa48("2540"), ""),
    "circleMatcherUrl": stryMutAct_9fa48("2541") ? "Stryker was here!" : (stryCov_9fa48("2541"), ""),
    "metricConfiguration": stryMutAct_9fa48("2542") ? "Stryker was here!" : (stryCov_9fa48("2542"), ""),
    "userGroups": stryMutAct_9fa48("2543") ? ["Stryker was here"] : (stryCov_9fa48("2543"), []),
    "createdAt": stryMutAct_9fa48("2544") ? "" : (stryCov_9fa48("2544"), "2021-02-24 13:02:25")
  }), stryMutAct_9fa48("2545") ? {} : (stryCov_9fa48("2545"), {
    "id": stryMutAct_9fa48("2546") ? "" : (stryCov_9fa48("2546"), "f554b2e5-ba2f-45bb-afea-e239983c58dd"),
    "name": stryMutAct_9fa48("2547") ? "" : (stryCov_9fa48("2547"), "Ieza tests"),
    "status": stryMutAct_9fa48("2548") ? "" : (stryCov_9fa48("2548"), "COMPLETE"),
    "authorId": stryMutAct_9fa48("2549") ? "" : (stryCov_9fa48("2549"), "1770c44f-6c5f-4cac-b29d-72fd3384b5f7"),
    "gitConfiguration": stryMutAct_9fa48("2550") ? "Stryker was here!" : (stryCov_9fa48("2550"), ""),
    "registryConfiguration": stryMutAct_9fa48("2551") ? "Stryker was here!" : (stryCov_9fa48("2551"), ""),
    "cdConfiguration": stryMutAct_9fa48("2552") ? "Stryker was here!" : (stryCov_9fa48("2552"), ""),
    "circleMatcherUrl": stryMutAct_9fa48("2553") ? "Stryker was here!" : (stryCov_9fa48("2553"), ""),
    "metricConfiguration": stryMutAct_9fa48("2554") ? "Stryker was here!" : (stryCov_9fa48("2554"), ""),
    "userGroups": stryMutAct_9fa48("2555") ? [] : (stryCov_9fa48("2555"), [stryMutAct_9fa48("2556") ? {} : (stryCov_9fa48("2556"), {
      "id": stryMutAct_9fa48("2557") ? "" : (stryCov_9fa48("2557"), "58a706ed-06e8-4662-b52e-3c308087169c"),
      "name": stryMutAct_9fa48("2558") ? "" : (stryCov_9fa48("2558"), " Profiling test"),
      "author": stryMutAct_9fa48("2559") ? {} : (stryCov_9fa48("2559"), {
        "id": stryMutAct_9fa48("2560") ? "" : (stryCov_9fa48("2560"), "1770c44f-6c5f-4cac-b29d-72fd3384b5f7"),
        "name": stryMutAct_9fa48("2561") ? "" : (stryCov_9fa48("2561"), "rootqa"),
        "email": stryMutAct_9fa48("2562") ? "" : (stryCov_9fa48("2562"), "rootqa@root"),
        "photoUrl": stryMutAct_9fa48("2563") ? "Stryker was here!" : (stryCov_9fa48("2563"), ""),
        "createdAt": stryMutAct_9fa48("2564") ? "" : (stryCov_9fa48("2564"), "2020-11-27 13:30:16"),
        "root": stryMutAct_9fa48("2565") ? true : (stryCov_9fa48("2565"), false)
      }),
      "createdAt": stryMutAct_9fa48("2566") ? "" : (stryCov_9fa48("2566"), "2020-11-30 18:17:48"),
      "users": stryMutAct_9fa48("2567") ? [] : (stryCov_9fa48("2567"), [stryMutAct_9fa48("2568") ? {} : (stryCov_9fa48("2568"), {
        "id": stryMutAct_9fa48("2569") ? "" : (stryCov_9fa48("2569"), "a2e3a4fa-3e9e-47fa-949b-187c72f1b652"),
        "name": stryMutAct_9fa48("2570") ? "" : (stryCov_9fa48("2570"), "Ieza Lopes"),
        "email": stryMutAct_9fa48("2571") ? "" : (stryCov_9fa48("2571"), "ieza.damasceno@zup.com.br"),
        "photoUrl": stryMutAct_9fa48("2572") ? "Stryker was here!" : (stryCov_9fa48("2572"), ""),
        "createdAt": stryMutAct_9fa48("2573") ? "" : (stryCov_9fa48("2573"), "2020-11-30 17:31:23"),
        "root": stryMutAct_9fa48("2574") ? true : (stryCov_9fa48("2574"), false)
      })])
    })]),
    "createdAt": stryMutAct_9fa48("2575") ? "" : (stryCov_9fa48("2575"), "2020-11-30 18:18:33")
  })]),
  "page": 0,
  "size": 5,
  "totalPages": 3,
  "last": stryMutAct_9fa48("2576") ? false : (stryCov_9fa48("2576"), true)
});