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

import { Deployment } from 'modules/Circles/interfaces/Circle';
export type WarningMessage = 'IMPORT_CSV' | 'MANUAL_TO_CSV' | 'CSV_TO_MANUAL' | 'MANUAL_TO_PERCENTAGE' | 'PERCENTAGE_TO_MANUAL' | 'PERCENTAGE_TO_CSV' | 'CSV_TO_PERCENTAGE';
export function getWarningText(warningMessage: WarningMessage) {
  if (stryMutAct_9fa48("2740")) {
    {}
  } else {
    stryCov_9fa48("2740");

    if (stryMutAct_9fa48("2743") ? warningMessage !== 'CSV_TO_MANUAL' : stryMutAct_9fa48("2742") ? false : stryMutAct_9fa48("2741") ? true : (stryCov_9fa48("2741", "2742", "2743"), warningMessage === (stryMutAct_9fa48("2744") ? "" : (stryCov_9fa48("2744"), 'CSV_TO_MANUAL')))) {
      if (stryMutAct_9fa48("2745")) {
        {}
      } else {
        stryCov_9fa48("2745");
        return stryMutAct_9fa48("2746") ? "" : (stryCov_9fa48("2746"), 'Your current base was imported using a .CSV file, manually creating your entire circle segmentation will be deleted and replaced.');
      }
    }

    if (stryMutAct_9fa48("2749") ? warningMessage !== 'MANUAL_TO_CSV' : stryMutAct_9fa48("2748") ? false : stryMutAct_9fa48("2747") ? true : (stryCov_9fa48("2747", "2748", "2749"), warningMessage === (stryMutAct_9fa48("2750") ? "" : (stryCov_9fa48("2750"), 'MANUAL_TO_CSV')))) {
      if (stryMutAct_9fa48("2751")) {
        {}
      } else {
        stryCov_9fa48("2751");
        return stryMutAct_9fa48("2752") ? "" : (stryCov_9fa48("2752"), 'Your current segmentation was created using manual rules, this rules will be replaced by the CSV content.');
      }
    }

    if (stryMutAct_9fa48("2755") ? warningMessage !== 'PERCENTAGE_TO_MANUAL' : stryMutAct_9fa48("2754") ? false : stryMutAct_9fa48("2753") ? true : (stryCov_9fa48("2753", "2754", "2755"), warningMessage === (stryMutAct_9fa48("2756") ? "" : (stryCov_9fa48("2756"), 'PERCENTAGE_TO_MANUAL')))) {
      if (stryMutAct_9fa48("2757")) {
        {}
      } else {
        stryCov_9fa48("2757");
        return stryMutAct_9fa48("2758") ? "" : (stryCov_9fa48("2758"), 'Your current percentage circle will be converted to segmentation circle.');
      }
    }

    if (stryMutAct_9fa48("2761") ? warningMessage !== 'PERCENTAGE_TO_CSV' : stryMutAct_9fa48("2760") ? false : stryMutAct_9fa48("2759") ? true : (stryCov_9fa48("2759", "2760", "2761"), warningMessage === (stryMutAct_9fa48("2762") ? "" : (stryCov_9fa48("2762"), 'PERCENTAGE_TO_CSV')))) {
      if (stryMutAct_9fa48("2763")) {
        {}
      } else {
        stryCov_9fa48("2763");
        return stryMutAct_9fa48("2764") ? "" : (stryCov_9fa48("2764"), 'Your current percentage circle will be converted to segmentation circle.');
      }
    }

    if (stryMutAct_9fa48("2767") ? warningMessage !== 'MANUAL_TO_PERCENTAGE' : stryMutAct_9fa48("2766") ? false : stryMutAct_9fa48("2765") ? true : (stryCov_9fa48("2765", "2766", "2767"), warningMessage === (stryMutAct_9fa48("2768") ? "" : (stryCov_9fa48("2768"), 'MANUAL_TO_PERCENTAGE')))) {
      if (stryMutAct_9fa48("2769")) {
        {}
      } else {
        stryCov_9fa48("2769");
        return stryMutAct_9fa48("2770") ? "" : (stryCov_9fa48("2770"), 'Your current segmentation will be deleted and replaced with percentage rules.');
      }
    }

    if (stryMutAct_9fa48("2773") ? warningMessage !== 'CSV_TO_PERCENTAGE' : stryMutAct_9fa48("2772") ? false : stryMutAct_9fa48("2771") ? true : (stryCov_9fa48("2771", "2772", "2773"), warningMessage === (stryMutAct_9fa48("2774") ? "" : (stryCov_9fa48("2774"), 'CSV_TO_PERCENTAGE')))) {
      if (stryMutAct_9fa48("2775")) {
        {}
      } else {
        stryCov_9fa48("2775");
        return stryMutAct_9fa48("2776") ? "" : (stryCov_9fa48("2776"), 'Your current segmentation will be deleted and replaced with percentage rules.');
      }
    }

    return stryMutAct_9fa48("2777") ? "" : (stryCov_9fa48("2777"), 'When you import another .CSV your entire circle segmentation will be deleted and replaced by the new one.');
  }
}
export const editingPercentageLimit = (limitPercentage: number, deployment: Deployment, percentage: number) => {
  if (stryMutAct_9fa48("2778")) {
    {}
  } else {
    stryCov_9fa48("2778");

    if (stryMutAct_9fa48("2781") ? limitPercentage > 0 || deployment : stryMutAct_9fa48("2780") ? false : stryMutAct_9fa48("2779") ? true : (stryCov_9fa48("2779", "2780", "2781"), (stryMutAct_9fa48("2785") ? limitPercentage <= 0 : stryMutAct_9fa48("2784") ? limitPercentage >= 0 : stryMutAct_9fa48("2783") ? false : stryMutAct_9fa48("2782") ? true : (stryCov_9fa48("2782", "2783", "2784", "2785"), limitPercentage > 0)) && deployment)) {
      if (stryMutAct_9fa48("2786")) {
        {}
      } else {
        stryCov_9fa48("2786");
        // if circle is already active, the percentage limit needs to take into account the current percentage of the circle.
        return stryMutAct_9fa48("2787") ? limitPercentage - percentage : (stryCov_9fa48("2787"), limitPercentage + percentage);
      }
    } else if (stryMutAct_9fa48("2790") ? limitPercentage > 0 || !deployment : stryMutAct_9fa48("2789") ? false : stryMutAct_9fa48("2788") ? true : (stryCov_9fa48("2788", "2789", "2790"), (stryMutAct_9fa48("2794") ? limitPercentage <= 0 : stryMutAct_9fa48("2793") ? limitPercentage >= 0 : stryMutAct_9fa48("2792") ? false : stryMutAct_9fa48("2791") ? true : (stryCov_9fa48("2791", "2792", "2793", "2794"), limitPercentage > 0)) && (stryMutAct_9fa48("2795") ? deployment : (stryCov_9fa48("2795"), !deployment)))) {
      if (stryMutAct_9fa48("2796")) {
        {}
      } else {
        stryCov_9fa48("2796");
        return limitPercentage;
      }
    } // only use this condition on editing, if circle is active but we have no open sea percentage available,
    // we use only circle percentage.


    return percentage;
  }
};
export const validatePercentage = (value: number, limitValue: number) => {
  if (stryMutAct_9fa48("2797")) {
    {}
  } else {
    stryCov_9fa48("2797");

    if (stryMutAct_9fa48("2801") ? value <= limitValue : stryMutAct_9fa48("2800") ? value >= limitValue : stryMutAct_9fa48("2799") ? false : stryMutAct_9fa48("2798") ? true : (stryCov_9fa48("2798", "2799", "2800", "2801"), value > limitValue)) {
      if (stryMutAct_9fa48("2802")) {
        {}
      } else {
        stryCov_9fa48("2802");
        return stryMutAct_9fa48("2803") ? `` : (stryCov_9fa48("2803"), `Percentage should be lower than ${limitValue}.`);
      }
    }

    if (stryMutAct_9fa48("2807") ? value >= 0 : stryMutAct_9fa48("2806") ? value <= 0 : stryMutAct_9fa48("2805") ? false : stryMutAct_9fa48("2804") ? true : (stryCov_9fa48("2804", "2805", "2806", "2807"), value < 0)) {
      if (stryMutAct_9fa48("2808")) {
        {}
      } else {
        stryCov_9fa48("2808");
        return stryMutAct_9fa48("2809") ? `` : (stryCov_9fa48("2809"), `Percentage cannot be negative.`);
      }
    }
  }
};