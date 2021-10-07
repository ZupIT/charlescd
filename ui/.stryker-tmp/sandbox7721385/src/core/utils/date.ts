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

import dayjs from 'dayjs';
import 'dayjs/locale/pt';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(utc);
export const dateFrom = (date: string) => {
  if (stryMutAct_9fa48("2107")) {
    {}
  } else {
    stryCov_9fa48("2107");
    const minutesInHours = 60;
    const hoursInADay = 24;
    const hoursAgo = dayjs().diff(date, stryMutAct_9fa48("2108") ? "" : (stryCov_9fa48("2108"), 'hour'));
    const guestTimezoneHour = stryMutAct_9fa48("2109") ? dayjs().utcOffset() * minutesInHours : (stryCov_9fa48("2109"), dayjs().utcOffset() / minutesInHours);
    const currentDate = dayjs(date).hour(stryMutAct_9fa48("2110") ? dayjs(date).hour() - guestTimezoneHour : (stryCov_9fa48("2110"), dayjs(date).hour() + guestTimezoneHour));

    if (stryMutAct_9fa48("2114") ? hoursAgo < hoursInADay : stryMutAct_9fa48("2113") ? hoursAgo > hoursInADay : stryMutAct_9fa48("2112") ? false : stryMutAct_9fa48("2111") ? true : (stryCov_9fa48("2111", "2112", "2113", "2114"), hoursAgo >= hoursInADay)) {
      if (stryMutAct_9fa48("2115")) {
        {}
      } else {
        stryCov_9fa48("2115");
        return dayjs(currentDate).format(stryMutAct_9fa48("2116") ? "" : (stryCov_9fa48("2116"), 'hh:mm • MM/DD/YYYY'));
      }
    }

    return dayjs(currentDate).fromNow();
  }
};
export const humanizeDurationFromSeconds = (timeInSeconds: number) => {
  if (stryMutAct_9fa48("2117")) {
    {}
  } else {
    stryCov_9fa48("2117");

    if (stryMutAct_9fa48("2120") ? false : stryMutAct_9fa48("2119") ? true : stryMutAct_9fa48("2118") ? timeInSeconds : (stryCov_9fa48("2118", "2119", "2120"), !timeInSeconds)) {
      if (stryMutAct_9fa48("2121")) {
        {}
      } else {
        stryCov_9fa48("2121");
        return stryMutAct_9fa48("2122") ? `` : (stryCov_9fa48("2122"), `0 s`);
      }
    }

    const seconds = dayjs.duration(timeInSeconds, stryMutAct_9fa48("2123") ? "" : (stryCov_9fa48("2123"), 'seconds')).seconds();
    const minutes = dayjs.duration(timeInSeconds, stryMutAct_9fa48("2124") ? "" : (stryCov_9fa48("2124"), 'seconds')).minutes();
    const hours = dayjs.duration(timeInSeconds, stryMutAct_9fa48("2125") ? "" : (stryCov_9fa48("2125"), 'seconds')).hours();
    const days = dayjs.duration(timeInSeconds, stryMutAct_9fa48("2126") ? "" : (stryCov_9fa48("2126"), 'seconds')).days();

    if (stryMutAct_9fa48("2128") ? false : stryMutAct_9fa48("2127") ? true : (stryCov_9fa48("2127", "2128"), days)) {
      if (stryMutAct_9fa48("2129")) {
        {}
      } else {
        stryCov_9fa48("2129");
        const daysToFormat = dayjs.duration(timeInSeconds, stryMutAct_9fa48("2130") ? "" : (stryCov_9fa48("2130"), 'seconds')).asDays();
        return stryMutAct_9fa48("2131") ? `` : (stryCov_9fa48("2131"), `${Math.trunc(daysToFormat)} days`);
      }
    }

    if (stryMutAct_9fa48("2133") ? false : stryMutAct_9fa48("2132") ? true : (stryCov_9fa48("2132", "2133"), hours)) {
      if (stryMutAct_9fa48("2134")) {
        {}
      } else {
        stryCov_9fa48("2134");
        return stryMutAct_9fa48("2135") ? `` : (stryCov_9fa48("2135"), `${hours}:${minutes}:${seconds} h`);
      }
    }

    if (stryMutAct_9fa48("2137") ? false : stryMutAct_9fa48("2136") ? true : (stryCov_9fa48("2136", "2137"), minutes)) {
      if (stryMutAct_9fa48("2138")) {
        {}
      } else {
        stryCov_9fa48("2138");
        return stryMutAct_9fa48("2139") ? `` : (stryCov_9fa48("2139"), `${minutes}:${seconds} m`);
      }
    }

    return stryMutAct_9fa48("2140") ? `` : (stryCov_9fa48("2140"), `${seconds} s`);
  }
};
export const dateTimeFormatter = (date: string | Date) => {
  if (stryMutAct_9fa48("2141")) {
    {}
  } else {
    stryCov_9fa48("2141");
    return dayjs.utc(date, stryMutAct_9fa48("2142") ? "" : (stryCov_9fa48("2142"), 'YYYY-MM-DD HH:MM:SS')).local().format(stryMutAct_9fa48("2143") ? "" : (stryCov_9fa48("2143"), 'DD/MM/YYYY | HH:mm:ss'));
  }
};
export const newDateTimeFormatter = (date: string | Date) => {
  if (stryMutAct_9fa48("2144")) {
    {}
  } else {
    stryCov_9fa48("2144");
    return dayjs(date).format(stryMutAct_9fa48("2145") ? "" : (stryCov_9fa48("2145"), 'DD/MM/YYYY | HH:mm:ss'));
  }
};