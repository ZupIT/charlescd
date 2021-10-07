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

import { Module } from 'modules/Modules/interfaces/Module';
import { Module as IModule, ModuleForm } from '../interfaces/Module';
import { Tag } from '../interfaces/Tag';
import map from 'lodash/map';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import findLastIndex from 'lodash/findLastIndex';
import groupBy from 'lodash/groupBy';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
const MAX_LENGTH = 63;
export const formatModuleOptions = (module: Module[]) => {
  if (stryMutAct_9fa48("3583")) {
    {}
  } else {
    stryCov_9fa48("3583");
    return map(module, stryMutAct_9fa48("3584") ? () => undefined : (stryCov_9fa48("3584"), content => stryMutAct_9fa48("3585") ? {} : (stryCov_9fa48("3585"), {
      label: content.name,
      value: content.id
    })));
  }
};
export const formatComponentOptions = (modules: Module[], componentId: string) => {
  if (stryMutAct_9fa48("3586")) {
    {}
  } else {
    stryCov_9fa48("3586");
    const module = find(modules, stryMutAct_9fa48("3587") ? () => undefined : (stryCov_9fa48("3587"), ({
      id
    }) => stryMutAct_9fa48("3590") ? id !== componentId : stryMutAct_9fa48("3589") ? false : stryMutAct_9fa48("3588") ? true : (stryCov_9fa48("3588", "3589", "3590"), id === componentId)));
    return map(stryMutAct_9fa48("3591") ? module.components : (stryCov_9fa48("3591"), module?.components), stryMutAct_9fa48("3592") ? () => undefined : (stryCov_9fa48("3592"), ({
      id,
      name
    }) => stryMutAct_9fa48("3593") ? {} : (stryCov_9fa48("3593"), {
      value: id,
      label: name
    })));
  }
};
export const formatTagOptions = (tags: Tag[]) => {
  if (stryMutAct_9fa48("3594")) {
    {}
  } else {
    stryCov_9fa48("3594");
    return map(tags, stryMutAct_9fa48("3595") ? () => undefined : (stryCov_9fa48("3595"), ({
      name,
      artifact
    }) => stryMutAct_9fa48("3596") ? {} : (stryCov_9fa48("3596"), {
      value: artifact,
      label: name
    })));
  }
};
interface Error {
  [key: string]: {
    type: string;
    message: string;
  };
}
export const checkIfComponentConflict = (modules: IModule[]) => {
  if (stryMutAct_9fa48("3597")) {
    {}
  } else {
    stryCov_9fa48("3597");
    const matchedList: number[] = stryMutAct_9fa48("3598") ? ["Stryker was here"] : (stryCov_9fa48("3598"), []);
    const error: Error = {};
    const NOT_FOUND = stryMutAct_9fa48("3599") ? +1 : (stryCov_9fa48("3599"), -1);
    forEach(modules, (module, index: number) => {
      if (stryMutAct_9fa48("3600")) {
        {}
      } else {
        stryCov_9fa48("3600");

        if (stryMutAct_9fa48("3603") ? false : stryMutAct_9fa48("3602") ? true : stryMutAct_9fa48("3601") ? includes(matchedList, index) : (stryCov_9fa48("3601", "3602", "3603"), !includes(matchedList, index))) {
          if (stryMutAct_9fa48("3604")) {
            {}
          } else {
            stryCov_9fa48("3604");
            const componentIndex = findLastIndex(modules, stryMutAct_9fa48("3605") ? () => undefined : (stryCov_9fa48("3605"), ({
              component
            }) => stryMutAct_9fa48("3608") ? component !== module.component : stryMutAct_9fa48("3607") ? false : stryMutAct_9fa48("3606") ? true : (stryCov_9fa48("3606", "3607", "3608"), component === module.component)));

            if (stryMutAct_9fa48("3611") ? componentIndex !== NOT_FOUND || componentIndex !== index : stryMutAct_9fa48("3610") ? false : stryMutAct_9fa48("3609") ? true : (stryCov_9fa48("3609", "3610", "3611"), (stryMutAct_9fa48("3614") ? componentIndex === NOT_FOUND : stryMutAct_9fa48("3613") ? false : stryMutAct_9fa48("3612") ? true : (stryCov_9fa48("3612", "3613", "3614"), componentIndex !== NOT_FOUND)) && (stryMutAct_9fa48("3617") ? componentIndex === index : stryMutAct_9fa48("3616") ? false : stryMutAct_9fa48("3615") ? true : (stryCov_9fa48("3615", "3616", "3617"), componentIndex !== index)))) {
              if (stryMutAct_9fa48("3618")) {
                {}
              } else {
                stryCov_9fa48("3618");
                error[stryMutAct_9fa48("3619") ? `` : (stryCov_9fa48("3619"), `modules[${index}].component`)] = stryMutAct_9fa48("3620") ? {} : (stryCov_9fa48("3620"), {
                  type: stryMutAct_9fa48("3621") ? `` : (stryCov_9fa48("3621"), `conflict with ${componentIndex}`),
                  message: stryMutAct_9fa48("3622") ? "" : (stryCov_9fa48("3622"), 'Component conflict')
                });
                error[stryMutAct_9fa48("3623") ? `` : (stryCov_9fa48("3623"), `modules[${componentIndex}].component`)] = stryMutAct_9fa48("3624") ? {} : (stryCov_9fa48("3624"), {
                  type: stryMutAct_9fa48("3625") ? `` : (stryCov_9fa48("3625"), `conflict with ${index}`),
                  message: stryMutAct_9fa48("3626") ? "" : (stryCov_9fa48("3626"), 'Component conflict')
                });
              }
            }
          }
        }
      }
    });
    return error;
  }
};
export const validationResolver = ({
  releaseName,
  modules
}: ModuleForm) => {
  if (stryMutAct_9fa48("3627")) {
    {}
  } else {
    stryCov_9fa48("3627");
    const error = checkIfComponentConflict(modules);

    if (stryMutAct_9fa48("3629") ? false : stryMutAct_9fa48("3628") ? true : (stryCov_9fa48("3628", "3629"), isEmpty(releaseName))) {
      if (stryMutAct_9fa48("3630")) {
        {}
      } else {
        stryCov_9fa48("3630");
        error[stryMutAct_9fa48("3631") ? "" : (stryCov_9fa48("3631"), 'releaseName')] = stryMutAct_9fa48("3632") ? {} : (stryCov_9fa48("3632"), {
          type: stryMutAct_9fa48("3633") ? `` : (stryCov_9fa48("3633"), `releaseName.required`),
          message: stryMutAct_9fa48("3634") ? "" : (stryCov_9fa48("3634"), 'This field is required')
        });
      }
    }

    return stryMutAct_9fa48("3635") ? {} : (stryCov_9fa48("3635"), {
      values: {},
      errors: error
    });
  }
};

const getVersion = (str: string) => {
  if (stryMutAct_9fa48("3636")) {
    {}
  } else {
    stryCov_9fa48("3636");
    const [, version] = str.split(stryMutAct_9fa48("3637") ? "" : (stryCov_9fa48("3637"), ':'));
    return version;
  }
};

export const formatDataModules = ({
  modules
}: {
  modules: IModule[];
}) => {
  if (stryMutAct_9fa48("3638")) {
    {}
  } else {
    stryCov_9fa48("3638");
    const groupedModules = groupBy(modules, stryMutAct_9fa48("3639") ? "" : (stryCov_9fa48("3639"), 'module'));
    return map(groupedModules, modules => {
      if (stryMutAct_9fa48("3640")) {
        {}
      } else {
        stryCov_9fa48("3640");
        const [module] = modules;
        const components = map(modules, stryMutAct_9fa48("3641") ? () => undefined : (stryCov_9fa48("3641"), module => stryMutAct_9fa48("3642") ? {} : (stryCov_9fa48("3642"), {
          id: module.component,
          version: getVersion(module.tag),
          artifact: module.tag
        })));
        return stryMutAct_9fa48("3643") ? {} : (stryCov_9fa48("3643"), {
          id: stryMutAct_9fa48("3644") ? module.module : (stryCov_9fa48("3644"), module?.module),
          components
        });
      }
    });
  }
};
export const validFields = (fields: object) => {
  if (stryMutAct_9fa48("3645")) {
    {}
  } else {
    stryCov_9fa48("3645");
    let status = stryMutAct_9fa48("3646") ? false : (stryCov_9fa48("3646"), true);
    forEach(fields, (value: string | IModule[]) => {
      if (stryMutAct_9fa48("3647")) {
        {}
      } else {
        stryCov_9fa48("3647");

        if (stryMutAct_9fa48("3649") ? false : stryMutAct_9fa48("3648") ? true : (stryCov_9fa48("3648", "3649"), isEmpty(value))) {
          if (stryMutAct_9fa48("3650")) {
            {}
          } else {
            stryCov_9fa48("3650");
            status = stryMutAct_9fa48("3651") ? true : (stryCov_9fa48("3651"), false);
          }
        }

        if (stryMutAct_9fa48("3653") ? false : stryMutAct_9fa48("3652") ? true : (stryCov_9fa48("3652", "3653"), Array.isArray(value))) {
          if (stryMutAct_9fa48("3654")) {
            {}
          } else {
            stryCov_9fa48("3654");
            status = stryMutAct_9fa48("3655") ? value.some(valueItem => !valueItem.tag) : (stryCov_9fa48("3655"), !value.some(stryMutAct_9fa48("3656") ? () => undefined : (stryCov_9fa48("3656"), valueItem => stryMutAct_9fa48("3657") ? valueItem.tag : (stryCov_9fa48("3657"), !valueItem.tag))));
          }
        }
      }
    });
    return status;
  }
};
interface Props {
  tag?: Tag;
  onError?: (error: boolean) => void;
  setIsError?: (error: boolean) => void;
}
export const checkComponentAndVersionMaxLength = ({
  tag,
  onError,
  setIsError
}: Props) => {
  if (stryMutAct_9fa48("3658")) {
    {}
  } else {
    stryCov_9fa48("3658");
    const componentAndVersion = stryMutAct_9fa48("3660") ? tag.artifact.split('/').reverse()?.[0] : stryMutAct_9fa48("3659") ? tag?.artifact.split('/').reverse()[0] : (stryCov_9fa48("3659", "3660"), tag?.artifact.split(stryMutAct_9fa48("3661") ? "" : (stryCov_9fa48("3661"), '/')).reverse()?.[0]);

    if (stryMutAct_9fa48("3665") ? componentAndVersion.length <= MAX_LENGTH : stryMutAct_9fa48("3664") ? componentAndVersion.length >= MAX_LENGTH : stryMutAct_9fa48("3663") ? false : stryMutAct_9fa48("3662") ? true : (stryCov_9fa48("3662", "3663", "3664", "3665"), componentAndVersion.length > MAX_LENGTH)) {
      if (stryMutAct_9fa48("3666")) {
        {}
      } else {
        stryCov_9fa48("3666");
        onError(stryMutAct_9fa48("3667") ? false : (stryCov_9fa48("3667"), true));
        setIsError(stryMutAct_9fa48("3668") ? false : (stryCov_9fa48("3668"), true));
      }
    } else {
      if (stryMutAct_9fa48("3669")) {
        {}
      } else {
        stryCov_9fa48("3669");
        onError(stryMutAct_9fa48("3670") ? true : (stryCov_9fa48("3670"), false));
        setIsError(stryMutAct_9fa48("3671") ? true : (stryCov_9fa48("3671"), false));
      }
    }
  }
};