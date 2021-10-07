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

import { DEPLOYMENT_STATUS } from "core/enums/DeploymentStatus";
import { Author, Circle, Deployment } from "modules/Circles/interfaces/Circle";
import { CirclePercentagePagination } from "modules/Circles/interfaces/CirclesPagination";
export const author: Author = stryMutAct_9fa48("2696") ? {} : (stryCov_9fa48("2696"), {
  id: stryMutAct_9fa48("2697") ? "" : (stryCov_9fa48("2697"), "fake-id"),
  name: stryMutAct_9fa48("2698") ? "" : (stryCov_9fa48("2698"), "fake-name"),
  email: stryMutAct_9fa48("2699") ? "" : (stryCov_9fa48("2699"), "fake-email"),
  createdAt: stryMutAct_9fa48("2700") ? "" : (stryCov_9fa48("2700"), "fake-data")
});
export const deployment: Deployment = stryMutAct_9fa48("2701") ? {} : (stryCov_9fa48("2701"), {
  artifacts: null,
  deployedAt: stryMutAct_9fa48("2702") ? "" : (stryCov_9fa48("2702"), "fake-timer"),
  id: stryMutAct_9fa48("2703") ? "" : (stryCov_9fa48("2703"), "fake-deployment-id"),
  status: DEPLOYMENT_STATUS.deployed,
  tag: stryMutAct_9fa48("2704") ? "" : (stryCov_9fa48("2704"), "fake-tag")
});
export const circle: Circle = stryMutAct_9fa48("2705") ? {} : (stryCov_9fa48("2705"), {
  author: author,
  createdAt: stryMutAct_9fa48("2706") ? "" : (stryCov_9fa48("2706"), "fake-data"),
  deployment: deployment,
  id: stryMutAct_9fa48("2707") ? "" : (stryCov_9fa48("2707"), "fake-id"),
  name: stryMutAct_9fa48("2708") ? "" : (stryCov_9fa48("2708"), "fake-circle"),
  rules: null,
  percentage: 10,
  matcherType: stryMutAct_9fa48("2709") ? "" : (stryCov_9fa48("2709"), "PERCENTAGE")
});
export const circlePercentage: Circle = stryMutAct_9fa48("2710") ? {} : (stryCov_9fa48("2710"), {
  author: author,
  createdAt: stryMutAct_9fa48("2711") ? "" : (stryCov_9fa48("2711"), "fake-data"),
  deployment: deployment,
  id: stryMutAct_9fa48("2712") ? "" : (stryCov_9fa48("2712"), "fake-id"),
  name: stryMutAct_9fa48("2713") ? "" : (stryCov_9fa48("2713"), "fake-circle"),
  rules: null,
  percentage: 10,
  matcherType: stryMutAct_9fa48("2714") ? "" : (stryCov_9fa48("2714"), "PERCENTAGE")
});
export const circleManually: Circle = stryMutAct_9fa48("2715") ? {} : (stryCov_9fa48("2715"), {
  author: author,
  createdAt: stryMutAct_9fa48("2716") ? "" : (stryCov_9fa48("2716"), "fake-data"),
  deployment: deployment,
  id: stryMutAct_9fa48("2717") ? "" : (stryCov_9fa48("2717"), "fake-id"),
  name: stryMutAct_9fa48("2718") ? "" : (stryCov_9fa48("2718"), "fake-circle"),
  rules: null,
  percentage: 10,
  matcherType: stryMutAct_9fa48("2719") ? "" : (stryCov_9fa48("2719"), "REGULAR")
});
export const circleCSV: Circle = stryMutAct_9fa48("2720") ? {} : (stryCov_9fa48("2720"), {
  author: author,
  createdAt: stryMutAct_9fa48("2721") ? "" : (stryCov_9fa48("2721"), "fake-data"),
  deployment: deployment,
  id: stryMutAct_9fa48("2722") ? "" : (stryCov_9fa48("2722"), "fake-id"),
  name: stryMutAct_9fa48("2723") ? "" : (stryCov_9fa48("2723"), "fake-circle"),
  rules: null,
  percentage: 10,
  matcherType: stryMutAct_9fa48("2724") ? "" : (stryCov_9fa48("2724"), "SIMPLE_KV")
});
export const mockPercentageCircles: CirclePercentagePagination = stryMutAct_9fa48("2725") ? {} : (stryCov_9fa48("2725"), {
  content: stryMutAct_9fa48("2726") ? [] : (stryCov_9fa48("2726"), [stryMutAct_9fa48("2727") ? {} : (stryCov_9fa48("2727"), {
    circles: stryMutAct_9fa48("2728") ? [] : (stryCov_9fa48("2728"), [circle]),
    sumPercentage: 10
  })]),
  page: 0,
  size: 100,
  totalPages: 2,
  last: stryMutAct_9fa48("2729") ? true : (stryCov_9fa48("2729"), false)
});
export const mockFullPercentageCircles: CirclePercentagePagination = stryMutAct_9fa48("2730") ? {} : (stryCov_9fa48("2730"), {
  content: stryMutAct_9fa48("2731") ? [] : (stryCov_9fa48("2731"), [stryMutAct_9fa48("2732") ? {} : (stryCov_9fa48("2732"), {
    circles: stryMutAct_9fa48("2733") ? [] : (stryCov_9fa48("2733"), [circle]),
    sumPercentage: 100
  })]),
  page: 0,
  size: 100,
  totalPages: 2,
  last: stryMutAct_9fa48("2734") ? true : (stryCov_9fa48("2734"), false)
});
export const mockEmptyPercentageCircles: CirclePercentagePagination = stryMutAct_9fa48("2735") ? {} : (stryCov_9fa48("2735"), {
  content: stryMutAct_9fa48("2736") ? [] : (stryCov_9fa48("2736"), [stryMutAct_9fa48("2737") ? {} : (stryCov_9fa48("2737"), {
    circles: stryMutAct_9fa48("2738") ? ["Stryker was here"] : (stryCov_9fa48("2738"), []),
    sumPercentage: 0
  })]),
  page: 0,
  size: 100,
  totalPages: 2,
  last: stryMutAct_9fa48("2739") ? true : (stryCov_9fa48("2739"), false)
});