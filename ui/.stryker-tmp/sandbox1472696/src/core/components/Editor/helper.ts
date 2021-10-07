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

import isEmpty from 'lodash/isEmpty';
import { KeyboardEvent } from 'react';
export const formatJSON = (jsonStr: string | object) => {
  if (stryMutAct_9fa48("453")) {
    {}
  } else {
    stryCov_9fa48("453");

    try {
      if (stryMutAct_9fa48("454")) {
        {}
      } else {
        stryCov_9fa48("454");
        const data = (stryMutAct_9fa48("457") ? typeof jsonStr === 'string' || !isEmpty(jsonStr) : stryMutAct_9fa48("456") ? false : stryMutAct_9fa48("455") ? true : (stryCov_9fa48("455", "456", "457"), (stryMutAct_9fa48("460") ? typeof jsonStr !== 'string' : stryMutAct_9fa48("459") ? false : stryMutAct_9fa48("458") ? true : (stryCov_9fa48("458", "459", "460"), typeof jsonStr === (stryMutAct_9fa48("461") ? "" : (stryCov_9fa48("461"), 'string')))) && (stryMutAct_9fa48("462") ? isEmpty(jsonStr) : (stryCov_9fa48("462"), !isEmpty(jsonStr))))) ? JSON.parse(jsonStr) : jsonStr;
        return JSON.stringify(data, null, 2);
      }
    } catch (e) {
      if (stryMutAct_9fa48("463")) {
        {}
      } else {
        stryCov_9fa48("463");
        console.error(e);
        return stryMutAct_9fa48("464") ? "Stryker was here!" : (stryCov_9fa48("464"), "");
      }
    }
  }
};
type Key = "{" | "[" | "'" | '"';
export const shouldComplete = (key: string) => {
  if (stryMutAct_9fa48("465")) {
    {}
  } else {
    stryCov_9fa48("465");
    const keys = stryMutAct_9fa48("466") ? {} : (stryCov_9fa48("466"), {
      "{": stryMutAct_9fa48("467") ? "" : (stryCov_9fa48("467"), "}"),
      "[": stryMutAct_9fa48("468") ? "" : (stryCov_9fa48("468"), "]"),
      "'": stryMutAct_9fa48("469") ? "" : (stryCov_9fa48("469"), "'"),
      '"': stryMutAct_9fa48("470") ? "" : (stryCov_9fa48("470"), '"')
    });
    return stryMutAct_9fa48("473") ? keys[(key as Key)] && "" : stryMutAct_9fa48("472") ? false : stryMutAct_9fa48("471") ? true : (stryCov_9fa48("471", "472", "473"), keys[(key as Key)] || (stryMutAct_9fa48("474") ? "Stryker was here!" : (stryCov_9fa48("474"), "")));
  }
};
export const TAB = stryMutAct_9fa48("475") ? "" : (stryCov_9fa48("475"), '  ');
export const insertValue = (e: KeyboardEvent, value: string, caretPosition = TAB.length) => {
  if (stryMutAct_9fa48("476")) {
    {}
  } else {
    stryCov_9fa48("476");
    const target = (e.target as HTMLTextAreaElement);
    const start = target.selectionStart;
    const end = target.selectionEnd;
    const targetValue = target.value;
    target.value = stryMutAct_9fa48("477") ? targetValue.substring(0, start) + value - targetValue.substring(end) : (stryCov_9fa48("477"), (stryMutAct_9fa48("478") ? targetValue.substring(0, start) - value : (stryCov_9fa48("478"), targetValue.substring(0, start) + value)) + targetValue.substring(end));
    target.selectionEnd = stryMutAct_9fa48("479") ? end - caretPosition : (stryCov_9fa48("479"), end + caretPosition);
    target.selectionStart = stryMutAct_9fa48("480") ? end - caretPosition : (stryCov_9fa48("480"), end + caretPosition);
  }
};
export const getLastTabs = (target: HTMLTextAreaElement) => {
  if (stryMutAct_9fa48("481")) {
    {}
  } else {
    stryCov_9fa48("481");
    const value = target.value;
    const lastLine = stryMutAct_9fa48("483") ? value.substring(0, target.selectionEnd).split('\n')?.reverse() : stryMutAct_9fa48("482") ? value.substring(0, target.selectionEnd)?.split('\n').reverse() : (stryCov_9fa48("482", "483"), value.substring(0, target.selectionEnd)?.split(stryMutAct_9fa48("484") ? "" : (stryCov_9fa48("484"), '\n'))?.reverse());
    return stryMutAct_9fa48("485") ? lastLine[0].split('"')[0].replace(/\{|\[/g, "") : (stryCov_9fa48("485"), lastLine[0].split(stryMutAct_9fa48("486") ? "" : (stryCov_9fa48("486"), '"'))[0]?.replace(/\{|\[/g, stryMutAct_9fa48("487") ? "Stryker was here!" : (stryCov_9fa48("487"), "")));
  }
};
export const onPressTab = (e: KeyboardEvent) => {
  if (stryMutAct_9fa48("488")) {
    {}
  } else {
    stryCov_9fa48("488");
    e.preventDefault();
    insertValue(e, TAB);
  }
};
export const onPressEnter = (e: KeyboardEvent) => {
  if (stryMutAct_9fa48("489")) {
    {}
  } else {
    stryCov_9fa48("489");
    e.preventDefault();
    const target = (e.target as HTMLTextAreaElement);
    const start = target.selectionStart;
    const lastChar = target.textContent.substring(stryMutAct_9fa48("490") ? start + 1 : (stryCov_9fa48("490"), start - 1), start);

    if (stryMutAct_9fa48("492") ? false : stryMutAct_9fa48("491") ? true : (stryCov_9fa48("491", "492"), (stryMutAct_9fa48("493") ? [] : (stryCov_9fa48("493"), [stryMutAct_9fa48("494") ? "" : (stryCov_9fa48("494"), '{'), stryMutAct_9fa48("495") ? "" : (stryCov_9fa48("495"), '[')])).includes(lastChar))) {
      if (stryMutAct_9fa48("496")) {
        {}
      } else {
        stryCov_9fa48("496");
        const lastTabs = getLastTabs(target);
        const tabs = stryMutAct_9fa48("497") ? lastTabs - TAB : (stryCov_9fa48("497"), lastTabs + TAB);
        const insertion = stryMutAct_9fa48("498") ? `` : (stryCov_9fa48("498"), `\n${tabs}`);
        const complete = isEmpty(lastTabs) ? stryMutAct_9fa48("499") ? `` : (stryCov_9fa48("499"), `\n`) : stryMutAct_9fa48("500") ? `` : (stryCov_9fa48("500"), `${tabs}\n${lastTabs}`);
        const len = insertion.length;
        insertValue(e, stryMutAct_9fa48("501") ? `` : (stryCov_9fa48("501"), `${stryMutAct_9fa48("502") ? insertion - complete : (stryCov_9fa48("502"), insertion + complete)}`), len);
      }
    } else if (stryMutAct_9fa48("505") ? lastChar !== ',' : stryMutAct_9fa48("504") ? false : stryMutAct_9fa48("503") ? true : (stryCov_9fa48("503", "504", "505"), lastChar === (stryMutAct_9fa48("506") ? "" : (stryCov_9fa48("506"), ',')))) {
      if (stryMutAct_9fa48("507")) {
        {}
      } else {
        stryCov_9fa48("507");
        const tabs = getLastTabs(target);
        const insertion = stryMutAct_9fa48("508") ? `` : (stryCov_9fa48("508"), `\n${tabs}`);
        insertValue(e, stryMutAct_9fa48("509") ? `` : (stryCov_9fa48("509"), `${insertion}`), insertion.length);
      }
    } else {
      if (stryMutAct_9fa48("510")) {
        {}
      } else {
        stryCov_9fa48("510");
        insertValue(e, stryMutAct_9fa48("511") ? "" : (stryCov_9fa48("511"), '\n'), 1);
      }
    }
  }
};
export const handleKeyDown = (e: KeyboardEvent) => {
  if (stryMutAct_9fa48("512")) {
    {}
  } else {
    stryCov_9fa48("512");

    if (stryMutAct_9fa48("515") ? e.key !== 'Tab' : stryMutAct_9fa48("514") ? false : stryMutAct_9fa48("513") ? true : (stryCov_9fa48("513", "514", "515"), e.key === (stryMutAct_9fa48("516") ? "" : (stryCov_9fa48("516"), 'Tab')))) {
      if (stryMutAct_9fa48("517")) {
        {}
      } else {
        stryCov_9fa48("517");
        onPressTab(e);
      }
    } else if (stryMutAct_9fa48("520") ? e.key !== 'Enter' : stryMutAct_9fa48("519") ? false : stryMutAct_9fa48("518") ? true : (stryCov_9fa48("518", "519", "520"), e.key === (stryMutAct_9fa48("521") ? "" : (stryCov_9fa48("521"), 'Enter')))) {
      if (stryMutAct_9fa48("522")) {
        {}
      } else {
        stryCov_9fa48("522");
        onPressEnter(e);
      }
    }
  }
};