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

import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';
export const validFields = (fields: object) => {
  if (stryMutAct_9fa48("2282")) {
    {}
  } else {
    stryCov_9fa48("2282");
    let status = stryMutAct_9fa48("2283") ? false : (stryCov_9fa48("2283"), true);
    forEach(fields, (value: string) => {
      if (stryMutAct_9fa48("2284")) {
        {}
      } else {
        stryCov_9fa48("2284");

        if (stryMutAct_9fa48("2286") ? false : stryMutAct_9fa48("2285") ? true : (stryCov_9fa48("2285", "2286"), isEmpty(value))) {
          if (stryMutAct_9fa48("2287")) {
            {}
          } else {
            stryCov_9fa48("2287");
            status = stryMutAct_9fa48("2288") ? true : (stryCov_9fa48("2288"), false);
          }
        }
      }
    });
    return status;
  }
};
export const isNotBlank = (value: string | any) => {
  if (stryMutAct_9fa48("2289")) {
    {}
  } else {
    stryCov_9fa48("2289");

    if (stryMutAct_9fa48("2292") ? value || isString(value) : stryMutAct_9fa48("2291") ? false : stryMutAct_9fa48("2290") ? true : (stryCov_9fa48("2290", "2291", "2292"), value && isString(value))) {
      if (stryMutAct_9fa48("2293")) {
        {}
      } else {
        stryCov_9fa48("2293");
        return stryMutAct_9fa48("2296") ? !!value.trim() && 'Cannot start with whitespaces' : stryMutAct_9fa48("2295") ? false : stryMutAct_9fa48("2294") ? true : (stryCov_9fa48("2294", "2295", "2296"), (stryMutAct_9fa48("2297") ? !value.trim() : (stryCov_9fa48("2297"), !(stryMutAct_9fa48("2298") ? value.trim() : (stryCov_9fa48("2298"), !value.trim())))) || (stryMutAct_9fa48("2299") ? "" : (stryCov_9fa48("2299"), 'Cannot start with whitespaces')));
      }
    }

    return value;
  }
};
export const trimValue = stryMutAct_9fa48("2300") ? () => undefined : (stryCov_9fa48("2300"), (() => {
  const trimValue = (value: unknown) => isString(value) ? stryMutAct_9fa48("2301") ? value.trim() : (stryCov_9fa48("2301"), value?.trim()) : value;

  return trimValue;
})());
export const isRequiredAndNotBlank = ({
  required: true,
  validate: {
    notBlank: isNotBlank
  },
  setValueAs: trimValue
} as const);
export const maxLength = stryMutAct_9fa48("2302") ? () => undefined : (stryCov_9fa48("2302"), (() => {
  const maxLength = (value = 64, message?: string) => stryMutAct_9fa48("2303") ? {} : (stryCov_9fa48("2303"), {
    value: value,
    message: stryMutAct_9fa48("2306") ? message && `The maximum value of this field is ${value}.` : stryMutAct_9fa48("2305") ? false : stryMutAct_9fa48("2304") ? true : (stryCov_9fa48("2304", "2305", "2306"), message || (stryMutAct_9fa48("2307") ? `` : (stryCov_9fa48("2307"), `The maximum value of this field is ${value}.`)))
  });

  return maxLength;
})());
export const minLength = stryMutAct_9fa48("2308") ? () => undefined : (stryCov_9fa48("2308"), (() => {
  const minLength = (value: number, message?: string) => stryMutAct_9fa48("2309") ? {} : (stryCov_9fa48("2309"), {
    value: value,
    message: stryMutAct_9fa48("2312") ? message && `The minimum value of this field is ${value}.` : stryMutAct_9fa48("2311") ? false : stryMutAct_9fa48("2310") ? true : (stryCov_9fa48("2310", "2311", "2312"), message || (stryMutAct_9fa48("2313") ? `` : (stryCov_9fa48("2313"), `The minimum value of this field is ${value}.`)))
  });

  return minLength;
})());
export const isRequired = stryMutAct_9fa48("2314") ? () => undefined : (stryCov_9fa48("2314"), (() => {
  const isRequired = () => stryMutAct_9fa48("2315") ? {} : (stryCov_9fa48("2315"), {
    value: stryMutAct_9fa48("2316") ? false : (stryCov_9fa48("2316"), true),
    message: stryMutAct_9fa48("2317") ? "" : (stryCov_9fa48("2317"), 'This field is required')
  });

  return isRequired;
})());
export const emailPattern = stryMutAct_9fa48("2318") ? () => undefined : (stryCov_9fa48("2318"), (() => {
  const emailPattern = () => stryMutAct_9fa48("2319") ? {} : (stryCov_9fa48("2319"), {
    value: stryMutAct_9fa48("2327") ? /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[^A-Z]{2,}$/i : stryMutAct_9fa48("2326") ? /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]$/i : stryMutAct_9fa48("2325") ? /^[A-Z0-9._%+-]+@[^A-Z0-9.-]+\.[A-Z]{2,}$/i : stryMutAct_9fa48("2324") ? /^[A-Z0-9._%+-]+@[A-Z0-9.-]\.[A-Z]{2,}$/i : stryMutAct_9fa48("2323") ? /^[^A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i : stryMutAct_9fa48("2322") ? /^[A-Z0-9._%+-]@[A-Z0-9.-]+\.[A-Z]{2,}$/i : stryMutAct_9fa48("2321") ? /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i : stryMutAct_9fa48("2320") ? /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i : (stryCov_9fa48("2320", "2321", "2322", "2323", "2324", "2325", "2326", "2327"), /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i),
    message: stryMutAct_9fa48("2328") ? "" : (stryCov_9fa48("2328"), 'Entered value does not match email format.')
  });

  return emailPattern;
})());
export const urlPattern = stryMutAct_9fa48("2329") ? () => undefined : (stryCov_9fa48("2329"), (() => {
  const urlPattern = () => stryMutAct_9fa48("2330") ? {} : (stryCov_9fa48("2330"), {
    value: stryMutAct_9fa48("2338") ? /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([^-a-zA-Z0-9()@:%_+.~#?&//=]*)/ : stryMutAct_9fa48("2337") ? /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=])/ : stryMutAct_9fa48("2336") ? /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[^a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/ : stryMutAct_9fa48("2335") ? /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/ : stryMutAct_9fa48("2334") ? /https?:\/\/(www\.)?[^-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/ : stryMutAct_9fa48("2333") ? /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/ : stryMutAct_9fa48("2332") ? /https?:\/\/(www\.)[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/ : stryMutAct_9fa48("2331") ? /https:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/ : (stryCov_9fa48("2331", "2332", "2333", "2334", "2335", "2336", "2337", "2338"), /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/),
    message: stryMutAct_9fa48("2339") ? "" : (stryCov_9fa48("2339"), 'Entered value does not match URL format with HTTP/HTTPS protocol.')
  });

  return urlPattern;
})());
export const atLeastOne = stryMutAct_9fa48("2340") ? () => undefined : (stryCov_9fa48("2340"), (() => {
  const atLeastOne = (values: string[]) => (stryMutAct_9fa48("2341") ? values.length : (stryCov_9fa48("2341"), values?.length)) ? stryMutAct_9fa48("2342") ? false : (stryCov_9fa48("2342"), true) : stryMutAct_9fa48("2343") ? "" : (stryCov_9fa48("2343"), 'At least one must be checked');

  return atLeastOne;
})());
export const validJSON = (value: string) => {
  if (stryMutAct_9fa48("2344")) {
    {}
  } else {
    stryCov_9fa48("2344");

    try {
      if (stryMutAct_9fa48("2345")) {
        {}
      } else {
        stryCov_9fa48("2345");
        JSON.parse(value);
        return stryMutAct_9fa48("2346") ? false : (stryCov_9fa48("2346"), true);
      }
    } catch (e) {
      if (stryMutAct_9fa48("2347")) {
        {}
      } else {
        stryCov_9fa48("2347");
        return stryMutAct_9fa48("2348") ? "" : (stryCov_9fa48("2348"), 'Enter a valid json');
      }
    }
  }
};