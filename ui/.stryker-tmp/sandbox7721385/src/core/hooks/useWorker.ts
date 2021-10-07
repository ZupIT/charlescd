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

import { useEffect, useRef, useState, useCallback } from 'react';
import { buildHeaders, basePath } from 'core/providers/base';
import { logout } from 'core/utils/auth';
import { getCircleId } from 'core/utils/circle';

function loadWorker(workerFile: Function) {
  if (stryMutAct_9fa48("1333")) {
    {}
  } else {
    stryCov_9fa48("1333");
    const code = workerFile.toString();
    const blob = new Blob(stryMutAct_9fa48("1334") ? [] : (stryCov_9fa48("1334"), [(stryMutAct_9fa48("1335") ? "" : (stryCov_9fa48("1335"), '(')) + code + (stryMutAct_9fa48("1336") ? "" : (stryCov_9fa48("1336"), ')()'))]));
    return new Worker(URL.createObjectURL(blob));
  }
}

const useWorker = <T>(workerFile: Function, initialValue?: T): [T, Function] => {
  if (stryMutAct_9fa48("1337")) {
    {}
  } else {
    stryCov_9fa48("1337");
    const worker = useRef<Worker>();
    const [data, setData] = useState<T>(initialValue);

    const terminateWorker = () => {
      if (stryMutAct_9fa48("1338")) {
        {}
      } else {
        stryCov_9fa48("1338");
        worker.current.terminate();
      }
    };

    const workerHook = useCallback((apiParams: object) => {
      if (stryMutAct_9fa48("1339")) {
        {}
      } else {
        stryCov_9fa48("1339");

        if (stryMutAct_9fa48("1341") ? false : stryMutAct_9fa48("1340") ? true : (stryCov_9fa48("1340", "1341"), worker.current)) {
          if (stryMutAct_9fa48("1342")) {
            {}
          } else {
            stryCov_9fa48("1342");
            terminateWorker();
          }
        }

        worker.current = loadWorker(workerFile);
        worker.current.postMessage(stryMutAct_9fa48("1343") ? {} : (stryCov_9fa48("1343"), {
          apiParams,
          headers: buildHeaders(stryMutAct_9fa48("1344") ? true : (stryCov_9fa48("1344"), false), getCircleId()),
          basePath
        }));
        worker.current.addEventListener(stryMutAct_9fa48("1345") ? "" : (stryCov_9fa48("1345"), 'message'), (event: MessageEvent) => {
          if (stryMutAct_9fa48("1346")) {
            {}
          } else {
            stryCov_9fa48("1346");

            if (stryMutAct_9fa48("1348") ? false : stryMutAct_9fa48("1347") ? true : (stryCov_9fa48("1347", "1348"), event.data.unauthorized)) {
              if (stryMutAct_9fa48("1349")) {
                {}
              } else {
                stryCov_9fa48("1349");
                logout();
              }
            } else {
              if (stryMutAct_9fa48("1350")) {
                {}
              } else {
                stryCov_9fa48("1350");
                setData(event.data);
              }
            }
          }
        });
      }
    }, stryMutAct_9fa48("1351") ? [] : (stryCov_9fa48("1351"), [workerFile]));
    useEffect(() => {
      if (stryMutAct_9fa48("1352")) {
        {}
      } else {
        stryCov_9fa48("1352");
        return stryMutAct_9fa48("1353") ? () => undefined : (stryCov_9fa48("1353"), () => terminateWorker());
      }
    }, stryMutAct_9fa48("1354") ? ["Stryker was here"] : (stryCov_9fa48("1354"), []));
    return stryMutAct_9fa48("1355") ? [] : (stryCov_9fa48("1355"), [data, workerHook]);
  }
};

export default useWorker;