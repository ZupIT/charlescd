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
import routes from 'core/constants/routes';
import { generatePathV1 } from 'core/utils/path';
import { DEPLOYMENT_STATUS } from 'core/enums/DeploymentStatus';
import { Circle } from 'modules/Circles/interfaces/Circle';
import { URL_PATH_POSITION, DEFAULT_CIRCLE } from './constants';
import { hasPermission } from 'core/utils/auth';
export type ChangeType = 'INCREASE' | 'DECREASE';
export const pathCircleEditById = stryMutAct_9fa48("3417") ? () => undefined : (stryCov_9fa48("3417"), (() => {
  const pathCircleEditById = (id: string) => generatePathV1(routes.circlesEdit, stryMutAct_9fa48("3418") ? {} : (stryCov_9fa48("3418"), {
    circleId: id
  }));

  return pathCircleEditById;
})());
export const pathCircleById = (id: string) => {
  if (stryMutAct_9fa48("3419")) {
    {}
  } else {
    stryCov_9fa48("3419");
    const path = window.location.href.split(stryMutAct_9fa48("3420") ? "" : (stryCov_9fa48("3420"), '?'))[URL_PATH_POSITION];
    return stryMutAct_9fa48("3421") ? `` : (stryCov_9fa48("3421"), `${path}?circle=${id}`);
  }
};
export const isDefaultCircle = stryMutAct_9fa48("3422") ? () => undefined : (stryCov_9fa48("3422"), (() => {
  const isDefaultCircle = (name: string) => stryMutAct_9fa48("3425") ? name !== DEFAULT_CIRCLE : stryMutAct_9fa48("3424") ? false : stryMutAct_9fa48("3423") ? true : (stryCov_9fa48("3423", "3424", "3425"), name === DEFAULT_CIRCLE);

  return isDefaultCircle;
})());
export const isDeploying = stryMutAct_9fa48("3426") ? () => undefined : (stryCov_9fa48("3426"), (() => {
  const isDeploying = (status: DEPLOYMENT_STATUS) => stryMutAct_9fa48("3429") ? DEPLOYMENT_STATUS.deploying !== status : stryMutAct_9fa48("3428") ? false : stryMutAct_9fa48("3427") ? true : (stryCov_9fa48("3427", "3428", "3429"), DEPLOYMENT_STATUS.deploying === status);

  return isDeploying;
})());
export const isUndeploying = stryMutAct_9fa48("3430") ? () => undefined : (stryCov_9fa48("3430"), (() => {
  const isUndeploying = (status: DEPLOYMENT_STATUS) => stryMutAct_9fa48("3433") ? DEPLOYMENT_STATUS.undeploying !== status : stryMutAct_9fa48("3432") ? false : stryMutAct_9fa48("3431") ? true : (stryCov_9fa48("3431", "3432", "3433"), DEPLOYMENT_STATUS.undeploying === status);

  return isUndeploying;
})());
export const isBusy = stryMutAct_9fa48("3434") ? () => undefined : (stryCov_9fa48("3434"), (() => {
  const isBusy = (status: DEPLOYMENT_STATUS) => stryMutAct_9fa48("3437") ? isDeploying(status) && isUndeploying(status) : stryMutAct_9fa48("3436") ? false : stryMutAct_9fa48("3435") ? true : (stryCov_9fa48("3435", "3436", "3437"), isDeploying(status) || isUndeploying(status));

  return isBusy;
})());
export const hasDeploy = stryMutAct_9fa48("3438") ? () => undefined : (stryCov_9fa48("3438"), (() => {
  const hasDeploy = (circle: Circle) => stryMutAct_9fa48("3439") ? isEmpty(circle?.deployment) : (stryCov_9fa48("3439"), !isEmpty(stryMutAct_9fa48("3440") ? circle.deployment : (stryCov_9fa48("3440"), circle?.deployment)));

  return hasDeploy;
})());
export const isUndeployable = stryMutAct_9fa48("3441") ? () => undefined : (stryCov_9fa48("3441"), (() => {
  const isUndeployable = (circle: Circle) => stryMutAct_9fa48("3444") ? hasDeploy(circle) && !isDefaultCircle(circle?.name) || !isBusy(circle?.deployment?.status) : stryMutAct_9fa48("3443") ? false : stryMutAct_9fa48("3442") ? true : (stryCov_9fa48("3442", "3443", "3444"), (stryMutAct_9fa48("3447") ? hasDeploy(circle) || !isDefaultCircle(circle?.name) : stryMutAct_9fa48("3446") ? false : stryMutAct_9fa48("3445") ? true : (stryCov_9fa48("3445", "3446", "3447"), hasDeploy(circle) && (stryMutAct_9fa48("3448") ? isDefaultCircle(circle?.name) : (stryCov_9fa48("3448"), !isDefaultCircle(stryMutAct_9fa48("3449") ? circle.name : (stryCov_9fa48("3449"), circle?.name)))))) && (stryMutAct_9fa48("3450") ? isBusy(circle?.deployment?.status) : (stryCov_9fa48("3450"), !isBusy(stryMutAct_9fa48("3452") ? circle.deployment?.status : stryMutAct_9fa48("3451") ? circle?.deployment.status : (stryCov_9fa48("3451", "3452"), circle?.deployment?.status)))));

  return isUndeployable;
})());
export const getTooltipMessage = (circle: Circle): string => {
  if (stryMutAct_9fa48("3453")) {
    {}
  } else {
    stryCov_9fa48("3453");
    const cannotDeleteActiveCircleMessage = stryMutAct_9fa48("3454") ? "" : (stryCov_9fa48("3454"), 'Active circle cannot be deleted,<br />you can undeploy first and then<br /> delete this circle.');
    const cannotDeleteDefaultCircleMessage = stryMutAct_9fa48("3455") ? "" : (stryCov_9fa48("3455"), 'Default circle is deployed to all<br /> users, so it cannot be deleted.');
    const cannotDeleteInactiveDefaultCircleMessage = stryMutAct_9fa48("3456") ? "" : (stryCov_9fa48("3456"), 'Default circle cannot be deleted.');
    let tooltipMessage = stryMutAct_9fa48("3457") ? "Stryker was here!" : (stryCov_9fa48("3457"), '');

    if (stryMutAct_9fa48("3460") ? isDefaultCircle(circle?.name) || !hasDeploy(circle) : stryMutAct_9fa48("3459") ? false : stryMutAct_9fa48("3458") ? true : (stryCov_9fa48("3458", "3459", "3460"), isDefaultCircle(stryMutAct_9fa48("3461") ? circle.name : (stryCov_9fa48("3461"), circle?.name)) && (stryMutAct_9fa48("3462") ? hasDeploy(circle) : (stryCov_9fa48("3462"), !hasDeploy(circle))))) {
      if (stryMutAct_9fa48("3463")) {
        {}
      } else {
        stryCov_9fa48("3463");
        tooltipMessage = cannotDeleteInactiveDefaultCircleMessage;
      }
    } else if (stryMutAct_9fa48("3466") ? isDefaultCircle(circle?.name) || hasDeploy(circle) : stryMutAct_9fa48("3465") ? false : stryMutAct_9fa48("3464") ? true : (stryCov_9fa48("3464", "3465", "3466"), isDefaultCircle(stryMutAct_9fa48("3467") ? circle.name : (stryCov_9fa48("3467"), circle?.name)) && hasDeploy(circle))) {
      if (stryMutAct_9fa48("3468")) {
        {}
      } else {
        stryCov_9fa48("3468");
        tooltipMessage = cannotDeleteDefaultCircleMessage;
      }
    } else if (stryMutAct_9fa48("3471") ? hasDeploy(circle) || hasPermission('deploy_write') : stryMutAct_9fa48("3470") ? false : stryMutAct_9fa48("3469") ? true : (stryCov_9fa48("3469", "3470", "3471"), hasDeploy(circle) && hasPermission(stryMutAct_9fa48("3472") ? "" : (stryCov_9fa48("3472"), 'deploy_write')))) {
      if (stryMutAct_9fa48("3473")) {
        {}
      } else {
        stryCov_9fa48("3473");
        tooltipMessage = cannotDeleteActiveCircleMessage;
      }
    } else if (stryMutAct_9fa48("3476") ? !hasPermission('deploy_write') || !hasDeploy(circle) : stryMutAct_9fa48("3475") ? false : stryMutAct_9fa48("3474") ? true : (stryCov_9fa48("3474", "3475", "3476"), (stryMutAct_9fa48("3477") ? hasPermission('deploy_write') : (stryCov_9fa48("3477"), !hasPermission(stryMutAct_9fa48("3478") ? "" : (stryCov_9fa48("3478"), 'deploy_write')))) && (stryMutAct_9fa48("3479") ? hasDeploy(circle) : (stryCov_9fa48("3479"), !hasDeploy(circle))))) {
      if (stryMutAct_9fa48("3480")) {
        {}
      } else {
        stryCov_9fa48("3480");
        tooltipMessage = stryMutAct_9fa48("3481") ? "" : (stryCov_9fa48("3481"), 'Not allowed');
      }
    } else if (stryMutAct_9fa48("3484") ? false : stryMutAct_9fa48("3483") ? true : stryMutAct_9fa48("3482") ? hasPermission('deploy_write') : (stryCov_9fa48("3482", "3483", "3484"), !hasPermission(stryMutAct_9fa48("3485") ? "" : (stryCov_9fa48("3485"), 'deploy_write')))) {
      if (stryMutAct_9fa48("3486")) {
        {}
      } else {
        stryCov_9fa48("3486");
        tooltipMessage = stryMutAct_9fa48("3487") ? "" : (stryCov_9fa48("3487"), 'Not allowed');
      }
    }

    return tooltipMessage;
  }
};
export const cannotCircleBeDeleted = (circle: Circle): boolean => {
  if (stryMutAct_9fa48("3488")) {
    {}
  } else {
    stryCov_9fa48("3488");
    return stryMutAct_9fa48("3491") ? (isUndeployable(circle) || isDefaultCircle(circle?.name)) && !hasPermission('circles_write') : stryMutAct_9fa48("3490") ? false : stryMutAct_9fa48("3489") ? true : (stryCov_9fa48("3489", "3490", "3491"), (stryMutAct_9fa48("3494") ? isUndeployable(circle) && isDefaultCircle(circle?.name) : stryMutAct_9fa48("3493") ? false : stryMutAct_9fa48("3492") ? true : (stryCov_9fa48("3492", "3493", "3494"), isUndeployable(circle) || isDefaultCircle(stryMutAct_9fa48("3495") ? circle.name : (stryCov_9fa48("3495"), circle?.name)))) || (stryMutAct_9fa48("3496") ? hasPermission('circles_write') : (stryCov_9fa48("3496"), !hasPermission(stryMutAct_9fa48("3497") ? "" : (stryCov_9fa48("3497"), 'circles_write')))));
  }
};