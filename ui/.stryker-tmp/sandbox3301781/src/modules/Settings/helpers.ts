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

import find from 'lodash/find';
import filter from 'lodash/filter';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import { getConfigByKey, setConfig } from 'core/utils/config';
import { getProfileByKey } from 'core/utils/profile';
type WizardItem = {
  email: string;
  enabled: boolean;
};
export const getWizardByUser = () => {
  if (stryMutAct_9fa48("6376")) {
    {}
  } else {
    stryCov_9fa48("6376");
    const email = getProfileByKey(stryMutAct_9fa48("6377") ? "" : (stryCov_9fa48("6377"), 'email'));
    const wizard = getConfigByKey(stryMutAct_9fa48("6378") ? "" : (stryCov_9fa48("6378"), 'wizard'));
    return stryMutAct_9fa48("6381") ? find(wizard, (item: WizardItem) => item.email === btoa(email)) && {
      enabled: true
    } : stryMutAct_9fa48("6380") ? false : stryMutAct_9fa48("6379") ? true : (stryCov_9fa48("6379", "6380", "6381"), find(wizard, stryMutAct_9fa48("6382") ? () => undefined : (stryCov_9fa48("6382"), (item: WizardItem) => stryMutAct_9fa48("6385") ? item.email !== btoa(email) : stryMutAct_9fa48("6384") ? false : stryMutAct_9fa48("6383") ? true : (stryCov_9fa48("6383", "6384", "6385"), item.email === btoa(email)))) || (stryMutAct_9fa48("6386") ? {} : (stryCov_9fa48("6386"), {
      enabled: stryMutAct_9fa48("6387") ? false : (stryCov_9fa48("6387"), true)
    })));
  }
};
export const removeWizard = () => {
  if (stryMutAct_9fa48("6388")) {
    {}
  } else {
    stryCov_9fa48("6388");
    const email = getProfileByKey(stryMutAct_9fa48("6389") ? "" : (stryCov_9fa48("6389"), 'email'));
    const wizard = getConfigByKey(stryMutAct_9fa48("6390") ? "" : (stryCov_9fa48("6390"), 'wizard'));
    const newWizard = filter(wizard, stryMutAct_9fa48("6391") ? () => undefined : (stryCov_9fa48("6391"), item => stryMutAct_9fa48("6394") ? !item.enabled || item.mail !== btoa(email) : stryMutAct_9fa48("6393") ? false : stryMutAct_9fa48("6392") ? true : (stryCov_9fa48("6392", "6393", "6394"), (stryMutAct_9fa48("6395") ? item.enabled : (stryCov_9fa48("6395"), !item.enabled)) && (stryMutAct_9fa48("6398") ? item.mail === btoa(email) : stryMutAct_9fa48("6397") ? false : stryMutAct_9fa48("6396") ? true : (stryCov_9fa48("6396", "6397", "6398"), item.mail !== btoa(email))))));
    setConfig(stryMutAct_9fa48("6399") ? "" : (stryCov_9fa48("6399"), 'wizard'), newWizard);
  }
};
export const setWizard = (enabled: boolean) => {
  if (stryMutAct_9fa48("6400")) {
    {}
  } else {
    stryCov_9fa48("6400");
    const email = getProfileByKey(stryMutAct_9fa48("6401") ? "" : (stryCov_9fa48("6401"), 'email'));
    const wizard = getConfigByKey(stryMutAct_9fa48("6402") ? "" : (stryCov_9fa48("6402"), 'wizard'));

    if (stryMutAct_9fa48("6405") ? false : stryMutAct_9fa48("6404") ? true : stryMutAct_9fa48("6403") ? isEmpty(getWizardByUser().email) : (stryCov_9fa48("6403", "6404", "6405"), !isEmpty(getWizardByUser().email))) {
      if (stryMutAct_9fa48("6406")) {
        {}
      } else {
        stryCov_9fa48("6406");
        setConfig(stryMutAct_9fa48("6407") ? "" : (stryCov_9fa48("6407"), 'wizard'), map(wizard, stryMutAct_9fa48("6408") ? () => undefined : (stryCov_9fa48("6408"), item => (stryMutAct_9fa48("6411") ? item.email !== btoa(email) : stryMutAct_9fa48("6410") ? false : stryMutAct_9fa48("6409") ? true : (stryCov_9fa48("6409", "6410", "6411"), item.email === btoa(email))) ? stryMutAct_9fa48("6412") ? {} : (stryCov_9fa48("6412"), { ...item,
          enabled
        }) : item)));
      }
    } else {
      if (stryMutAct_9fa48("6413")) {
        {}
      } else {
        stryCov_9fa48("6413");
        setConfig(stryMutAct_9fa48("6414") ? "" : (stryCov_9fa48("6414"), 'wizard'), stryMutAct_9fa48("6415") ? [] : (stryCov_9fa48("6415"), [...(stryMutAct_9fa48("6418") ? wizard && [] : stryMutAct_9fa48("6417") ? false : stryMutAct_9fa48("6416") ? true : (stryCov_9fa48("6416", "6417", "6418"), wizard || (stryMutAct_9fa48("6419") ? ["Stryker was here"] : (stryCov_9fa48("6419"), [])))), stryMutAct_9fa48("6420") ? {} : (stryCov_9fa48("6420"), {
          email: btoa(email),
          enabled
        })]));
      }
    }
  }
};