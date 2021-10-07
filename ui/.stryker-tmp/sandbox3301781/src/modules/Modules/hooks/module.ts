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

import { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'core/state/hooks';
import { useHistory } from 'react-router-dom';
import { useFetch } from 'core/providers/base/hooks';
import { findAll, findById, create, deleteModule, update } from 'core/providers/modules';
import routes from 'core/constants/routes';
import { delParam, updateUntitledParam, updateParam } from 'core/utils/path';
import { toogleNotification } from 'core/components/Notification/state/actions';
import { ModulePagination } from 'modules/Modules/interfaces/ModulePagination';
import { Module } from 'modules/Modules/interfaces/Module';
import { loadModulesAction, resetModulesAction } from 'modules/Modules/state/actions';
export const useFindAllModules = (): {
  getAllModules: Function;
  response: ModulePagination;
  loading: boolean;
} => {
  if (stryMutAct_9fa48("5422")) {
    {}
  } else {
    stryCov_9fa48("5422");
    const dispatch = useDispatch();
    const [modulesData, getModules] = useFetch<ModulePagination>(findAll);
    const {
      response,
      loading
    } = modulesData;
    const getAllModules = useCallback((name: string, page = 0) => {
      if (stryMutAct_9fa48("5423")) {
        {}
      } else {
        stryCov_9fa48("5423");
        getModules(stryMutAct_9fa48("5424") ? {} : (stryCov_9fa48("5424"), {
          name,
          page
        }));
      }
    }, stryMutAct_9fa48("5425") ? [] : (stryCov_9fa48("5425"), [getModules]));
    useEffect(() => {
      if (stryMutAct_9fa48("5426")) {
        {}
      } else {
        stryCov_9fa48("5426");

        if (stryMutAct_9fa48("5428") ? false : stryMutAct_9fa48("5427") ? true : (stryCov_9fa48("5427", "5428"), response)) {
          if (stryMutAct_9fa48("5429")) {
            {}
          } else {
            stryCov_9fa48("5429");
            dispatch(loadModulesAction(response));
          }
        }
      }
    }, stryMutAct_9fa48("5430") ? [] : (stryCov_9fa48("5430"), [response, dispatch]));
    return stryMutAct_9fa48("5431") ? {} : (stryCov_9fa48("5431"), {
      getAllModules,
      response,
      loading
    });
  }
};
export const useFindModule = (): {
  getModuleById: Function;
  response: Module;
  error: Response;
  loading: boolean;
} => {
  if (stryMutAct_9fa48("5432")) {
    {}
  } else {
    stryCov_9fa48("5432");
    const [modulesData, getModuleById] = useFetch<Module>(findById);
    const {
      response,
      loading,
      error
    } = modulesData;
    const dispatch = useDispatch();
    useEffect(() => {
      if (stryMutAct_9fa48("5433")) {
        {}
      } else {
        stryCov_9fa48("5433");

        (async () => {
          if (stryMutAct_9fa48("5434")) {
            {}
          } else {
            stryCov_9fa48("5434");

            if (stryMutAct_9fa48("5436") ? false : stryMutAct_9fa48("5435") ? true : (stryCov_9fa48("5435", "5436"), error)) {
              if (stryMutAct_9fa48("5437")) {
                {}
              } else {
                stryCov_9fa48("5437");
                const e = await (stryMutAct_9fa48("5439") ? error.json?.() : stryMutAct_9fa48("5438") ? error?.json() : (stryCov_9fa48("5438", "5439"), error?.json?.()));
                dispatch(toogleNotification(stryMutAct_9fa48("5440") ? {} : (stryCov_9fa48("5440"), {
                  text: stryMutAct_9fa48("5441") ? `` : (stryCov_9fa48("5441"), `${stryMutAct_9fa48("5442") ? error.status : (stryCov_9fa48("5442"), error?.status)}: ${stryMutAct_9fa48("5443") ? e.message : (stryCov_9fa48("5443"), e?.message)}`),
                  status: stryMutAct_9fa48("5444") ? "" : (stryCov_9fa48("5444"), 'error')
                })));
              }
            }
          }
        })();
      }
    }, stryMutAct_9fa48("5445") ? [] : (stryCov_9fa48("5445"), [dispatch, error]));
    return stryMutAct_9fa48("5446") ? {} : (stryCov_9fa48("5446"), {
      getModuleById,
      response,
      error,
      loading
    });
  }
};
export const useSaveModule = (): {
  loading: boolean;
  saveModule: Function;
} => {
  if (stryMutAct_9fa48("5447")) {
    {}
  } else {
    stryCov_9fa48("5447");
    const [data, saveModule] = useFetch<Module>(create);
    const {
      getAllModules,
      response: modules
    } = useFindAllModules();
    const {
      response,
      error,
      loading
    } = data;
    const dispatch = useDispatch();
    useEffect(() => {
      if (stryMutAct_9fa48("5448")) {
        {}
      } else {
        stryCov_9fa48("5448");

        if (stryMutAct_9fa48("5450") ? false : stryMutAct_9fa48("5449") ? true : (stryCov_9fa48("5449", "5450"), response)) {
          if (stryMutAct_9fa48("5451")) {
            {}
          } else {
            stryCov_9fa48("5451");
            updateUntitledParam(stryMutAct_9fa48("5452") ? "" : (stryCov_9fa48("5452"), 'module'), response.id);
            getAllModules();
          }
        }
      }
    }, stryMutAct_9fa48("5453") ? [] : (stryCov_9fa48("5453"), [response, getAllModules, dispatch]));
    useEffect(() => {
      if (stryMutAct_9fa48("5454")) {
        {}
      } else {
        stryCov_9fa48("5454");

        if (stryMutAct_9fa48("5456") ? false : stryMutAct_9fa48("5455") ? true : (stryCov_9fa48("5455", "5456"), modules)) {
          if (stryMutAct_9fa48("5457")) {
            {}
          } else {
            stryCov_9fa48("5457");
            dispatch(resetModulesAction());
            dispatch(loadModulesAction(modules));
          }
        }
      }
    }, stryMutAct_9fa48("5458") ? [] : (stryCov_9fa48("5458"), [modules, dispatch]));
    useEffect(() => {
      if (stryMutAct_9fa48("5459")) {
        {}
      } else {
        stryCov_9fa48("5459");

        (async () => {
          if (stryMutAct_9fa48("5460")) {
            {}
          } else {
            stryCov_9fa48("5460");

            if (stryMutAct_9fa48("5462") ? false : stryMutAct_9fa48("5461") ? true : (stryCov_9fa48("5461", "5462"), error)) {
              if (stryMutAct_9fa48("5463")) {
                {}
              } else {
                stryCov_9fa48("5463");
                const e = await error.json();
                dispatch(toogleNotification(stryMutAct_9fa48("5464") ? {} : (stryCov_9fa48("5464"), {
                  text: stryMutAct_9fa48("5465") ? `` : (stryCov_9fa48("5465"), `${error.status}: ${stryMutAct_9fa48("5466") ? e.message : (stryCov_9fa48("5466"), e?.message)}`),
                  status: stryMutAct_9fa48("5467") ? "" : (stryCov_9fa48("5467"), 'error')
                })));
              }
            }
          }
        })();
      }
    }, stryMutAct_9fa48("5468") ? [] : (stryCov_9fa48("5468"), [dispatch, error]));
    return stryMutAct_9fa48("5469") ? {} : (stryCov_9fa48("5469"), {
      loading,
      saveModule
    });
  }
};
export const useDeleteModule = (module: Module): {
  removeModule: Function;
  response: Module;
  error: Response;
  loading: boolean;
} => {
  if (stryMutAct_9fa48("5470")) {
    {}
  } else {
    stryCov_9fa48("5470");
    const [data, removeModule] = useFetch<Module>(deleteModule);
    const {
      getAllModules,
      response: modules
    } = useFindAllModules();
    const {
      response,
      error,
      loading
    } = data;
    const dispatch = useDispatch();
    const history = useHistory();
    useEffect(() => {
      if (stryMutAct_9fa48("5471")) {
        {}
      } else {
        stryCov_9fa48("5471");

        if (stryMutAct_9fa48("5473") ? false : stryMutAct_9fa48("5472") ? true : (stryCov_9fa48("5472", "5473"), response)) {
          if (stryMutAct_9fa48("5474")) {
            {}
          } else {
            stryCov_9fa48("5474");
            getAllModules();
          }
        }
      }
    }, stryMutAct_9fa48("5475") ? [] : (stryCov_9fa48("5475"), [response, getAllModules, history, module]));
    useEffect(() => {
      if (stryMutAct_9fa48("5476")) {
        {}
      } else {
        stryCov_9fa48("5476");

        if (stryMutAct_9fa48("5478") ? false : stryMutAct_9fa48("5477") ? true : (stryCov_9fa48("5477", "5478"), modules)) {
          if (stryMutAct_9fa48("5479")) {
            {}
          } else {
            stryCov_9fa48("5479");
            delParam(stryMutAct_9fa48("5480") ? "" : (stryCov_9fa48("5480"), 'module'), routes.modulesComparation, history, stryMutAct_9fa48("5481") ? module.id : (stryCov_9fa48("5481"), module?.id));
            dispatch(resetModulesAction());
            dispatch(loadModulesAction(modules));
          }
        }
      }
    }, stryMutAct_9fa48("5482") ? [] : (stryCov_9fa48("5482"), [dispatch, modules, history, module]));
    useEffect(() => {
      if (stryMutAct_9fa48("5483")) {
        {}
      } else {
        stryCov_9fa48("5483");

        (async () => {
          if (stryMutAct_9fa48("5484")) {
            {}
          } else {
            stryCov_9fa48("5484");

            if (stryMutAct_9fa48("5486") ? false : stryMutAct_9fa48("5485") ? true : (stryCov_9fa48("5485", "5486"), error)) {
              if (stryMutAct_9fa48("5487")) {
                {}
              } else {
                stryCov_9fa48("5487");
                const e = await (stryMutAct_9fa48("5489") ? error.json?.() : stryMutAct_9fa48("5488") ? error?.json() : (stryCov_9fa48("5488", "5489"), error?.json?.()));
                dispatch(toogleNotification(stryMutAct_9fa48("5490") ? {} : (stryCov_9fa48("5490"), {
                  text: stryMutAct_9fa48("5491") ? `` : (stryCov_9fa48("5491"), `${error.status}: ${stryMutAct_9fa48("5492") ? e.message : (stryCov_9fa48("5492"), e?.message)}`),
                  status: stryMutAct_9fa48("5493") ? "" : (stryCov_9fa48("5493"), 'error')
                })));
              }
            } else if (stryMutAct_9fa48("5495") ? false : stryMutAct_9fa48("5494") ? true : (stryCov_9fa48("5494", "5495"), response)) {
              if (stryMutAct_9fa48("5496")) {
                {}
              } else {
                stryCov_9fa48("5496");
                dispatch(toogleNotification(stryMutAct_9fa48("5497") ? {} : (stryCov_9fa48("5497"), {
                  text: stryMutAct_9fa48("5498") ? `` : (stryCov_9fa48("5498"), `The module ${stryMutAct_9fa48("5499") ? module.name : (stryCov_9fa48("5499"), module?.name)} has been deleted`),
                  status: stryMutAct_9fa48("5500") ? "" : (stryCov_9fa48("5500"), 'success')
                })));
              }
            }
          }
        })();
      }
    }, stryMutAct_9fa48("5501") ? [] : (stryCov_9fa48("5501"), [dispatch, error, response, module]));
    return stryMutAct_9fa48("5502") ? {} : (stryCov_9fa48("5502"), {
      removeModule,
      response,
      error,
      loading
    });
  }
};
export const useUpdateModule = (): {
  updateModule: Function;
  status: string;
} => {
  if (stryMutAct_9fa48("5503")) {
    {}
  } else {
    stryCov_9fa48("5503");
    const [,, updateModulePromise] = useFetch<Module>(update);
    const {
      response: modules,
      getAllModules
    } = useFindAllModules();
    const [status, setStatus] = useState(stryMutAct_9fa48("5504") ? "Stryker was here!" : (stryCov_9fa48("5504"), ''));
    const [moduleId, setModuleId] = useState<string>(null);
    const history = useHistory();
    const dispatch = useDispatch();
    useEffect(() => {
      if (stryMutAct_9fa48("5505")) {
        {}
      } else {
        stryCov_9fa48("5505");

        if (stryMutAct_9fa48("5507") ? false : stryMutAct_9fa48("5506") ? true : (stryCov_9fa48("5506", "5507"), modules)) {
          if (stryMutAct_9fa48("5508")) {
            {}
          } else {
            stryCov_9fa48("5508");
            updateParam(stryMutAct_9fa48("5509") ? "" : (stryCov_9fa48("5509"), 'module'), routes.modulesComparation, history, moduleId, stryMutAct_9fa48("5510") ? `` : (stryCov_9fa48("5510"), `${moduleId}~view`));
          }
        }
      }
    }, stryMutAct_9fa48("5511") ? [] : (stryCov_9fa48("5511"), [moduleId, history, modules]));
    const updateModule = useCallback(async (id: string, module: Module) => {
      if (stryMutAct_9fa48("5512")) {
        {}
      } else {
        stryCov_9fa48("5512");
        setStatus(stryMutAct_9fa48("5513") ? "" : (stryCov_9fa48("5513"), 'pending'));
        setModuleId(id);

        try {
          if (stryMutAct_9fa48("5514")) {
            {}
          } else {
            stryCov_9fa48("5514");
            await updateModulePromise(id, module);
            dispatch(resetModulesAction());
            getAllModules();
            setStatus(stryMutAct_9fa48("5515") ? "" : (stryCov_9fa48("5515"), 'resolved'));
          }
        } catch (error) {
          if (stryMutAct_9fa48("5516")) {
            {}
          } else {
            stryCov_9fa48("5516");
            setStatus(stryMutAct_9fa48("5517") ? "" : (stryCov_9fa48("5517"), 'rejected'));
            dispatch(toogleNotification(stryMutAct_9fa48("5518") ? {} : (stryCov_9fa48("5518"), {
              text: stryMutAct_9fa48("5519") ? `` : (stryCov_9fa48("5519"), `${error.status}: ${error.statusText}`),
              status: stryMutAct_9fa48("5520") ? "" : (stryCov_9fa48("5520"), 'error')
            })));
          }
        }
      }
    }, stryMutAct_9fa48("5521") ? [] : (stryCov_9fa48("5521"), [updateModulePromise, dispatch, getAllModules]));
    return stryMutAct_9fa48("5522") ? {} : (stryCov_9fa48("5522"), {
      updateModule,
      status
    });
  }
};