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

import { NotificationState } from '../interfaces/NotificationState';
import { NotificationActionTypes, ACTION_TYPES } from './actions';
import { Notification } from '../interfaces/Notification';
const initialNotificationItemState: Notification = stryMutAct_9fa48("1079") ? {} : (stryCov_9fa48("1079"), {
  isVisible: stryMutAct_9fa48("1080") ? true : (stryCov_9fa48("1080"), false),
  text: stryMutAct_9fa48("1081") ? "" : (stryCov_9fa48("1081"), 'Message'),
  status: stryMutAct_9fa48("1082") ? "" : (stryCov_9fa48("1082"), 'success')
});
export const notificationInitialState: NotificationState = stryMutAct_9fa48("1083") ? {} : (stryCov_9fa48("1083"), {
  notification: initialNotificationItemState
});
export const notificationReducer = (state = notificationInitialState, action: NotificationActionTypes): NotificationState => {
  if (stryMutAct_9fa48("1084")) {
    {}
  } else {
    stryCov_9fa48("1084");

    switch (action.type) {
      case ACTION_TYPES.toogleNotification:
        if (stryMutAct_9fa48("1085")) {} else {
          stryCov_9fa48("1085");
          {
            if (stryMutAct_9fa48("1086")) {
              {}
            } else {
              stryCov_9fa48("1086");
              return stryMutAct_9fa48("1087") ? {} : (stryCov_9fa48("1087"), {
                notification: stryMutAct_9fa48("1088") ? {} : (stryCov_9fa48("1088"), {
                  isVisible: stryMutAct_9fa48("1089") ? false : (stryCov_9fa48("1089"), true),
                  text: action.payload.text,
                  status: action.payload.status
                })
              });
            }
          }
        }

      case ACTION_TYPES.dismissNotification:
        if (stryMutAct_9fa48("1090")) {} else {
          stryCov_9fa48("1090");
          {
            if (stryMutAct_9fa48("1091")) {
              {}
            } else {
              stryCov_9fa48("1091");
              return stryMutAct_9fa48("1092") ? {} : (stryCov_9fa48("1092"), {
                notification: initialNotificationItemState
              });
            }
          }
        }

      default:
        if (stryMutAct_9fa48("1093")) {} else {
          stryCov_9fa48("1093");
          {
            if (stryMutAct_9fa48("1094")) {
              {}
            } else {
              stryCov_9fa48("1094");
              return state;
            }
          }
        }

    }
  }
};