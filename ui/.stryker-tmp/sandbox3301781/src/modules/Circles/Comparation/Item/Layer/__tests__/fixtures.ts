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
export const MetricsGroupsResume = stryMutAct_9fa48("2891") ? [] : (stryCov_9fa48("2891"), [stryMutAct_9fa48("2892") ? {} : (stryCov_9fa48("2892"), {
  id: stryMutAct_9fa48("2893") ? "" : (stryCov_9fa48("2893"), '1'),
  createdAt: stryMutAct_9fa48("2894") ? "" : (stryCov_9fa48("2894"), '2020-09-05T12:20:40.406925Z'),
  name: stryMutAct_9fa48("2895") ? "" : (stryCov_9fa48("2895"), 'Metrics group 1'),
  metricsCount: 1,
  thresholds: 10,
  thresholdsReached: 0,
  status: stryMutAct_9fa48("2896") ? "" : (stryCov_9fa48("2896"), 'ACTIVE')
}), stryMutAct_9fa48("2897") ? {} : (stryCov_9fa48("2897"), {
  id: stryMutAct_9fa48("2898") ? "" : (stryCov_9fa48("2898"), '2'),
  createdAt: stryMutAct_9fa48("2899") ? "" : (stryCov_9fa48("2899"), '2020-09-04T12:20:40.406925Z'),
  name: stryMutAct_9fa48("2900") ? "" : (stryCov_9fa48("2900"), 'Metrics group 2'),
  metricsCount: 2,
  thresholds: 3,
  thresholdsReached: 3,
  status: stryMutAct_9fa48("2901") ? "" : (stryCov_9fa48("2901"), 'ACTIVE')
}), stryMutAct_9fa48("2902") ? {} : (stryCov_9fa48("2902"), {
  id: stryMutAct_9fa48("2903") ? "" : (stryCov_9fa48("2903"), '3'),
  createdAt: stryMutAct_9fa48("2904") ? "" : (stryCov_9fa48("2904"), '2020-09-03T12:20:40.406925Z'),
  name: stryMutAct_9fa48("2905") ? "" : (stryCov_9fa48("2905"), 'Metrics group 3'),
  metricsCount: 3,
  thresholds: 4,
  thresholdsReached: 2,
  status: stryMutAct_9fa48("2906") ? "" : (stryCov_9fa48("2906"), 'ERROR')
}), stryMutAct_9fa48("2907") ? {} : (stryCov_9fa48("2907"), {
  id: stryMutAct_9fa48("2908") ? "" : (stryCov_9fa48("2908"), '4'),
  createdAt: stryMutAct_9fa48("2909") ? "" : (stryCov_9fa48("2909"), '2020-09-02T12:20:40.406925Z'),
  name: stryMutAct_9fa48("2910") ? "" : (stryCov_9fa48("2910"), 'Metrics group 4'),
  metricsCount: 4,
  thresholds: 5,
  thresholdsReached: 4,
  status: stryMutAct_9fa48("2911") ? "" : (stryCov_9fa48("2911"), 'REACHED')
}), stryMutAct_9fa48("2912") ? {} : (stryCov_9fa48("2912"), {
  id: stryMutAct_9fa48("2913") ? "" : (stryCov_9fa48("2913"), '5'),
  createdAt: stryMutAct_9fa48("2914") ? "" : (stryCov_9fa48("2914"), '2020-09-01T12:20:40.406925Z'),
  name: stryMutAct_9fa48("2915") ? "" : (stryCov_9fa48("2915"), 'Metrics group 5'),
  metricsCount: 5,
  thresholds: 0,
  thresholdsReached: 0,
  status: stryMutAct_9fa48("2916") ? "" : (stryCov_9fa48("2916"), 'ACTIVE')
}), stryMutAct_9fa48("2917") ? {} : (stryCov_9fa48("2917"), {
  id: stryMutAct_9fa48("2918") ? "" : (stryCov_9fa48("2918"), '6'),
  createdAt: stryMutAct_9fa48("2919") ? "" : (stryCov_9fa48("2919"), '2020-08-30T12:20:40.406925Z'),
  name: stryMutAct_9fa48("2920") ? "" : (stryCov_9fa48("2920"), 'Metrics group 6'),
  metricsCount: 6,
  thresholds: 1,
  thresholdsReached: 0,
  status: stryMutAct_9fa48("2921") ? "" : (stryCov_9fa48("2921"), 'ACTIVE')
})]);
export const author: Author = stryMutAct_9fa48("2922") ? {} : (stryCov_9fa48("2922"), {
  id: stryMutAct_9fa48("2923") ? "" : (stryCov_9fa48("2923"), "fake-id"),
  name: stryMutAct_9fa48("2924") ? "" : (stryCov_9fa48("2924"), "fake-name"),
  email: stryMutAct_9fa48("2925") ? "" : (stryCov_9fa48("2925"), "fake-email"),
  createdAt: stryMutAct_9fa48("2926") ? "" : (stryCov_9fa48("2926"), "fake-data")
});
export const deployment: Deployment = stryMutAct_9fa48("2927") ? {} : (stryCov_9fa48("2927"), {
  artifacts: null,
  deployedAt: stryMutAct_9fa48("2928") ? "" : (stryCov_9fa48("2928"), "fake-timer"),
  id: stryMutAct_9fa48("2929") ? "" : (stryCov_9fa48("2929"), "fake-deployment-id"),
  status: DEPLOYMENT_STATUS.deployed,
  tag: stryMutAct_9fa48("2930") ? "" : (stryCov_9fa48("2930"), "fake-tag")
});
export const circle: Circle = stryMutAct_9fa48("2931") ? {} : (stryCov_9fa48("2931"), {
  author: author,
  createdAt: stryMutAct_9fa48("2932") ? "" : (stryCov_9fa48("2932"), "fake-data"),
  deployment: deployment,
  id: stryMutAct_9fa48("2933") ? "" : (stryCov_9fa48("2933"), "fake-id"),
  name: stryMutAct_9fa48("2934") ? "" : (stryCov_9fa48("2934"), "fake-circle"),
  rules: null,
  percentage: 10,
  matcherType: stryMutAct_9fa48("2935") ? "" : (stryCov_9fa48("2935"), "PERCENTAGE")
});
export const regularCircle: Circle = stryMutAct_9fa48("2936") ? {} : (stryCov_9fa48("2936"), {
  author: author,
  createdAt: stryMutAct_9fa48("2937") ? "" : (stryCov_9fa48("2937"), "fake-data"),
  deployment: deployment,
  id: stryMutAct_9fa48("2938") ? "" : (stryCov_9fa48("2938"), "fake-id"),
  name: stryMutAct_9fa48("2939") ? "" : (stryCov_9fa48("2939"), "fake-circle"),
  rules: stryMutAct_9fa48("2940") ? {} : (stryCov_9fa48("2940"), {
    type: stryMutAct_9fa48("2941") ? "" : (stryCov_9fa48("2941"), 'CLAUSE'),
    clauses: stryMutAct_9fa48("2942") ? [] : (stryCov_9fa48("2942"), [stryMutAct_9fa48("2943") ? {} : (stryCov_9fa48("2943"), {
      type: stryMutAct_9fa48("2944") ? "" : (stryCov_9fa48("2944"), 'RULE'),
      content: stryMutAct_9fa48("2945") ? {} : (stryCov_9fa48("2945"), {
        key: stryMutAct_9fa48("2946") ? "" : (stryCov_9fa48("2946"), 'username'),
        value: stryMutAct_9fa48("2947") ? [] : (stryCov_9fa48("2947"), [stryMutAct_9fa48("2948") ? "" : (stryCov_9fa48("2948"), 'empty')]),
        condition: stryMutAct_9fa48("2949") ? "" : (stryCov_9fa48("2949"), 'EQUAL')
      })
    })]),
    logicalOperator: stryMutAct_9fa48("2950") ? "" : (stryCov_9fa48("2950"), 'OR')
  }),
  percentage: 10,
  matcherType: stryMutAct_9fa48("2951") ? "" : (stryCov_9fa48("2951"), "REGULAR")
});
export const circleWithoutDeployment: Circle = stryMutAct_9fa48("2952") ? {} : (stryCov_9fa48("2952"), {
  author: author,
  createdAt: stryMutAct_9fa48("2953") ? "" : (stryCov_9fa48("2953"), "fake-data"),
  deployment: null,
  id: stryMutAct_9fa48("2954") ? "" : (stryCov_9fa48("2954"), "fake-id"),
  name: stryMutAct_9fa48("2955") ? "" : (stryCov_9fa48("2955"), "fake-circle"),
  rules: null,
  percentage: 10,
  matcherType: stryMutAct_9fa48("2956") ? "" : (stryCov_9fa48("2956"), "PERCENTAGE")
});
export const circleData: Circle = stryMutAct_9fa48("2957") ? {} : (stryCov_9fa48("2957"), {
  id: stryMutAct_9fa48("2958") ? "" : (stryCov_9fa48("2958"), '427'),
  name: stryMutAct_9fa48("2959") ? "" : (stryCov_9fa48("2959"), 'yyz'),
  author: stryMutAct_9fa48("2960") ? {} : (stryCov_9fa48("2960"), {
    id: stryMutAct_9fa48("2961") ? "" : (stryCov_9fa48("2961"), '1980'),
    name: stryMutAct_9fa48("2962") ? "" : (stryCov_9fa48("2962"), 'Rush'),
    email: stryMutAct_9fa48("2963") ? "" : (stryCov_9fa48("2963"), 'rush@zup'),
    createdAt: stryMutAct_9fa48("2964") ? "" : (stryCov_9fa48("2964"), 'old')
  }),
  createdAt: stryMutAct_9fa48("2965") ? "" : (stryCov_9fa48("2965"), '1981'),
  deployment: undefined,
  rules: undefined
});
export const newCircleData: Circle = stryMutAct_9fa48("2966") ? {} : (stryCov_9fa48("2966"), {
  id: undefined,
  name: undefined,
  author: undefined,
  createdAt: undefined,
  deployment: undefined,
  rules: undefined
});