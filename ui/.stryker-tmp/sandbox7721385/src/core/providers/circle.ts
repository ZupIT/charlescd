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

import { baseRequest, postRequest } from './base';
import { ParameterPayload } from 'modules/Circles/Matcher/interfaces';
import { CreateCircleWithFilePayload, CreateCircleManuallyPayload, CreateCirclePercentagePayload } from 'modules/Circles/interfaces/Circle';
import { DEFAULT_PAGE_SIZE } from 'core/constants/request';
export const endpoint = stryMutAct_9fa48("1566") ? "" : (stryCov_9fa48("1566"), '/moove/v2/circles');
export interface CircleFilter {
  id?: string;
  name?: string;
  active?: boolean;
  page?: number;
}
const initialCircleFilter = stryMutAct_9fa48("1567") ? {} : (stryCov_9fa48("1567"), {
  name: stryMutAct_9fa48("1568") ? "Stryker was here!" : (stryCov_9fa48("1568"), ''),
  active: stryMutAct_9fa48("1569") ? false : (stryCov_9fa48("1569"), true),
  page: 0
});
export const findAllCircles = (filter: CircleFilter = initialCircleFilter) => {
  if (stryMutAct_9fa48("1570")) {
    {}
  } else {
    stryCov_9fa48("1570");
    const params = new URLSearchParams(stryMutAct_9fa48("1571") ? {} : (stryCov_9fa48("1571"), {
      active: stryMutAct_9fa48("1572") ? `` : (stryCov_9fa48("1572"), `${stryMutAct_9fa48("1573") ? filter.active : (stryCov_9fa48("1573"), filter?.active)}`),
      size: stryMutAct_9fa48("1574") ? `` : (stryCov_9fa48("1574"), `${DEFAULT_PAGE_SIZE}`),
      name: stryMutAct_9fa48("1575") ? filter.name : (stryCov_9fa48("1575"), filter?.name),
      page: stryMutAct_9fa48("1576") ? `` : (stryCov_9fa48("1576"), `${stryMutAct_9fa48("1577") ? filter.page && 0 : (stryCov_9fa48("1577"), filter.page ?? 0)}`)
    }));
    return baseRequest(stryMutAct_9fa48("1578") ? `` : (stryCov_9fa48("1578"), `${endpoint}?${params}`));
  }
};
export const findPercentageCircles = (filter: CircleFilter = initialCircleFilter) => {
  if (stryMutAct_9fa48("1579")) {
    {}
  } else {
    stryCov_9fa48("1579");
    const sizeFixed = 200;
    const params = new URLSearchParams(stryMutAct_9fa48("1580") ? {} : (stryCov_9fa48("1580"), {
      active: stryMutAct_9fa48("1581") ? `` : (stryCov_9fa48("1581"), `${stryMutAct_9fa48("1582") ? filter.active : (stryCov_9fa48("1582"), filter?.active)}`),
      size: stryMutAct_9fa48("1583") ? `` : (stryCov_9fa48("1583"), `${sizeFixed}`),
      name: stryMutAct_9fa48("1584") ? filter.name : (stryCov_9fa48("1584"), filter?.name)
    }));
    return baseRequest(stryMutAct_9fa48("1585") ? `` : (stryCov_9fa48("1585"), `${endpoint}/percentage?${params}`));
  }
};
export const findComponents = stryMutAct_9fa48("1586") ? () => undefined : (stryCov_9fa48("1586"), (() => {
  const findComponents = (id: string) => baseRequest(stryMutAct_9fa48("1587") ? `` : (stryCov_9fa48("1587"), `${endpoint}/${id}/components`));

  return findComponents;
})());
export const findCircleById = stryMutAct_9fa48("1588") ? () => undefined : (stryCov_9fa48("1588"), (() => {
  const findCircleById = (filter: CircleFilter) => baseRequest(stryMutAct_9fa48("1589") ? `` : (stryCov_9fa48("1589"), `${endpoint}/${stryMutAct_9fa48("1590") ? filter.id : (stryCov_9fa48("1590"), filter?.id)}`));

  return findCircleById;
})());
export const deleteCircleById = stryMutAct_9fa48("1591") ? () => undefined : (stryCov_9fa48("1591"), (() => {
  const deleteCircleById = (id: string) => baseRequest(stryMutAct_9fa48("1592") ? `` : (stryCov_9fa48("1592"), `${endpoint}/${id}`), null, stryMutAct_9fa48("1593") ? {} : (stryCov_9fa48("1593"), {
    method: stryMutAct_9fa48("1594") ? "" : (stryCov_9fa48("1594"), 'DELETE')
  }));

  return deleteCircleById;
})());
export const circleMatcherIdentify = stryMutAct_9fa48("1595") ? () => undefined : (stryCov_9fa48("1595"), (() => {
  const circleMatcherIdentify = (data: ParameterPayload) => postRequest(stryMutAct_9fa48("1596") ? `` : (stryCov_9fa48("1596"), `${endpoint}/identify`), data);

  return circleMatcherIdentify;
})());
export const createCircleManually = stryMutAct_9fa48("1597") ? () => undefined : (stryCov_9fa48("1597"), (() => {
  const createCircleManually = (data: CreateCircleManuallyPayload) => baseRequest(stryMutAct_9fa48("1598") ? `` : (stryCov_9fa48("1598"), `${endpoint}`), data, stryMutAct_9fa48("1599") ? {} : (stryCov_9fa48("1599"), {
    method: stryMutAct_9fa48("1600") ? "" : (stryCov_9fa48("1600"), 'POST')
  }));

  return createCircleManually;
})());
export const createCirclePercentage = stryMutAct_9fa48("1601") ? () => undefined : (stryCov_9fa48("1601"), (() => {
  const createCirclePercentage = (data: CreateCirclePercentagePayload) => baseRequest(stryMutAct_9fa48("1602") ? `` : (stryCov_9fa48("1602"), `${endpoint}/percentage`), data, stryMutAct_9fa48("1603") ? {} : (stryCov_9fa48("1603"), {
    method: stryMutAct_9fa48("1604") ? "" : (stryCov_9fa48("1604"), 'POST')
  }));

  return createCirclePercentage;
})());
export const updateCirclePercentage = (data: CreateCirclePercentagePayload, id: string) => {
  if (stryMutAct_9fa48("1605")) {
    {}
  } else {
    stryCov_9fa48("1605");
    const payload = stryMutAct_9fa48("1606") ? {} : (stryCov_9fa48("1606"), {
      patches: stryMutAct_9fa48("1607") ? [] : (stryCov_9fa48("1607"), [stryMutAct_9fa48("1608") ? {} : (stryCov_9fa48("1608"), {
        op: stryMutAct_9fa48("1609") ? "" : (stryCov_9fa48("1609"), 'replace'),
        path: stryMutAct_9fa48("1610") ? "" : (stryCov_9fa48("1610"), '/percentage'),
        value: data.percentage
      }), stryMutAct_9fa48("1611") ? {} : (stryCov_9fa48("1611"), {
        op: stryMutAct_9fa48("1612") ? "" : (stryCov_9fa48("1612"), 'replace'),
        path: stryMutAct_9fa48("1613") ? "" : (stryCov_9fa48("1613"), '/name'),
        value: data.name
      })])
    });
    return baseRequest(stryMutAct_9fa48("1614") ? `` : (stryCov_9fa48("1614"), `${endpoint}/${id}/percentage`), payload, stryMutAct_9fa48("1615") ? {} : (stryCov_9fa48("1615"), {
      method: stryMutAct_9fa48("1616") ? "" : (stryCov_9fa48("1616"), 'PATCH')
    }));
  }
};
export const updateCircleManually = (data: CreateCircleManuallyPayload, circleId: string) => {
  if (stryMutAct_9fa48("1617")) {
    {}
  } else {
    stryCov_9fa48("1617");
    const payload = stryMutAct_9fa48("1618") ? {} : (stryCov_9fa48("1618"), {
      patches: stryMutAct_9fa48("1619") ? [] : (stryCov_9fa48("1619"), [stryMutAct_9fa48("1620") ? {} : (stryCov_9fa48("1620"), {
        op: stryMutAct_9fa48("1621") ? "" : (stryCov_9fa48("1621"), 'replace'),
        path: stryMutAct_9fa48("1622") ? "" : (stryCov_9fa48("1622"), '/rules'),
        value: data.rules
      }), stryMutAct_9fa48("1623") ? {} : (stryCov_9fa48("1623"), {
        op: stryMutAct_9fa48("1624") ? "" : (stryCov_9fa48("1624"), 'replace'),
        path: stryMutAct_9fa48("1625") ? "" : (stryCov_9fa48("1625"), '/name'),
        value: data.name
      })])
    });
    return baseRequest(stryMutAct_9fa48("1626") ? `` : (stryCov_9fa48("1626"), `${endpoint}/${circleId}`), payload, stryMutAct_9fa48("1627") ? {} : (stryCov_9fa48("1627"), {
      method: stryMutAct_9fa48("1628") ? "" : (stryCov_9fa48("1628"), 'PATCH')
    }));
  }
};
export const createCircleWithFile = stryMutAct_9fa48("1629") ? () => undefined : (stryCov_9fa48("1629"), (() => {
  const createCircleWithFile = (data: CreateCircleWithFilePayload) => baseRequest(stryMutAct_9fa48("1630") ? `` : (stryCov_9fa48("1630"), `${endpoint}/csv`), data, stryMutAct_9fa48("1631") ? {} : (stryCov_9fa48("1631"), {
    method: stryMutAct_9fa48("1632") ? "" : (stryCov_9fa48("1632"), 'POST')
  }));

  return createCircleWithFile;
})());
export const updateCircleWithFile = stryMutAct_9fa48("1633") ? () => undefined : (stryCov_9fa48("1633"), (() => {
  const updateCircleWithFile = (data: CreateCircleWithFilePayload, circleId: string) => baseRequest(stryMutAct_9fa48("1634") ? `` : (stryCov_9fa48("1634"), `${endpoint}/${circleId}/csv`), data, stryMutAct_9fa48("1635") ? {} : (stryCov_9fa48("1635"), {
    method: stryMutAct_9fa48("1636") ? "" : (stryCov_9fa48("1636"), 'PUT')
  }));

  return updateCircleWithFile;
})());
export const findAllCirclesWithoutActive = (filter: CircleFilter = initialCircleFilter) => {
  if (stryMutAct_9fa48("1637")) {
    {}
  } else {
    stryCov_9fa48("1637");
    const params = new URLSearchParams(stryMutAct_9fa48("1638") ? {} : (stryCov_9fa48("1638"), {
      size: stryMutAct_9fa48("1639") ? `` : (stryCov_9fa48("1639"), `${DEFAULT_PAGE_SIZE}`),
      name: stryMutAct_9fa48("1640") ? filter.name : (stryCov_9fa48("1640"), filter?.name)
    }));
    return baseRequest(stryMutAct_9fa48("1641") ? `` : (stryCov_9fa48("1641"), `${endpoint}?${params}`));
  }
};
export const findAllCirclesSimple = (filter: CircleFilter = initialCircleFilter) => {
  if (stryMutAct_9fa48("1642")) {
    {}
  } else {
    stryCov_9fa48("1642");
    const paramsWithOurActive = new URLSearchParams(stryMutAct_9fa48("1643") ? {} : (stryCov_9fa48("1643"), {
      size: stryMutAct_9fa48("1644") ? `` : (stryCov_9fa48("1644"), `${DEFAULT_PAGE_SIZE}`),
      name: stryMutAct_9fa48("1645") ? filter.name : (stryCov_9fa48("1645"), filter?.name),
      except: stryMutAct_9fa48("1646") ? filter.id : (stryCov_9fa48("1646"), filter?.id)
    }));
    const params = new URLSearchParams(stryMutAct_9fa48("1647") ? {} : (stryCov_9fa48("1647"), {
      size: stryMutAct_9fa48("1648") ? `` : (stryCov_9fa48("1648"), `${DEFAULT_PAGE_SIZE}`),
      name: stryMutAct_9fa48("1649") ? filter.name : (stryCov_9fa48("1649"), filter?.name),
      except: stryMutAct_9fa48("1650") ? filter.id : (stryCov_9fa48("1650"), filter?.id),
      active: stryMutAct_9fa48("1651") ? `` : (stryCov_9fa48("1651"), `${stryMutAct_9fa48("1652") ? filter.active : (stryCov_9fa48("1652"), filter?.active)}`)
    }));
    if (stryMutAct_9fa48("1655") ? filter.active : stryMutAct_9fa48("1654") ? false : stryMutAct_9fa48("1653") ? true : (stryCov_9fa48("1653", "1654", "1655"), filter?.active)) return baseRequest(stryMutAct_9fa48("1656") ? `` : (stryCov_9fa48("1656"), `${endpoint}/simple?${params}`));
    return baseRequest(stryMutAct_9fa48("1657") ? `` : (stryCov_9fa48("1657"), `${endpoint}/simple?${paramsWithOurActive}`));
  }
};