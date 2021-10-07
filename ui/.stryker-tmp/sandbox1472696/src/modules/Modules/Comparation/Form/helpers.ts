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

import { isNotBlank, isRequired, trimValue } from 'core/utils/validations';
import forEach from 'lodash/forEach';
import { Helm } from 'modules/Modules/interfaces/Helm';
import { DEFAULT_BRANCH, githubProvider, gitlabProvider } from 'modules/Settings/Credentials/Sections/DeploymentConfiguration/constants';
import { GitProviders } from 'modules/Settings/Credentials/Sections/DeploymentConfiguration/interfaces';
type SetValue = (name: keyof Helm, value: unknown, config?: Partial<{
  shouldValidate: boolean;
  shouldDirty: boolean;
}>) => void;
export const validFields = (fields: object) => {
  if (stryMutAct_9fa48("5132")) {
    {}
  } else {
    stryCov_9fa48("5132");
    let status = stryMutAct_9fa48("5133") ? false : (stryCov_9fa48("5133"), true);
    forEach(fields, (value: string) => {
      if (stryMutAct_9fa48("5134")) {
        {}
      } else {
        stryCov_9fa48("5134");

        if (stryMutAct_9fa48("5137") ? value !== '' : stryMutAct_9fa48("5136") ? false : stryMutAct_9fa48("5135") ? true : (stryCov_9fa48("5135", "5136", "5137"), value === (stryMutAct_9fa48("5138") ? "Stryker was here!" : (stryCov_9fa48("5138"), '')))) {
          if (stryMutAct_9fa48("5139")) {
            {}
          } else {
            stryCov_9fa48("5139");
            status = stryMutAct_9fa48("5140") ? true : (stryCov_9fa48("5140"), false);
            return status;
          }
        }
      }
    });
    return status;
  }
};
export const createGithubApi = ({
  helmUrl,
  helmOrganization,
  helmRepository,
  helmPath,
  helmBranch
}: Helm) => {
  if (stryMutAct_9fa48("5141")) {
    {}
  } else {
    stryCov_9fa48("5141");
    let url = stryMutAct_9fa48("5142") ? `` : (stryCov_9fa48("5142"), `${helmUrl}/repos/${helmOrganization}/${helmRepository}/contents`);

    if (stryMutAct_9fa48("5144") ? false : stryMutAct_9fa48("5143") ? true : (stryCov_9fa48("5143", "5144"), helmPath)) {
      if (stryMutAct_9fa48("5145")) {
        {}
      } else {
        stryCov_9fa48("5145");
        url = stryMutAct_9fa48("5146") ? `` : (stryCov_9fa48("5146"), `${helmUrl}/repos/${helmOrganization}/${helmRepository}/contents/${helmPath}`);
      }
    }

    const params = new URLSearchParams(stryMutAct_9fa48("5147") ? {} : (stryCov_9fa48("5147"), {
      ref: stryMutAct_9fa48("5150") ? helmBranch && DEFAULT_BRANCH : stryMutAct_9fa48("5149") ? false : stryMutAct_9fa48("5148") ? true : (stryCov_9fa48("5148", "5149", "5150"), helmBranch || DEFAULT_BRANCH)
    }));
    return stryMutAct_9fa48("5151") ? `` : (stryCov_9fa48("5151"), `${url}?${params}`);
  }
};

const createGitlabApi = ({
  helmUrl,
  helmProjectId,
  helmPath,
  helmBranch
}: Helm) => {
  if (stryMutAct_9fa48("5152")) {
    {}
  } else {
    stryCov_9fa48("5152");
    let url = stryMutAct_9fa48("5153") ? `` : (stryCov_9fa48("5153"), `${helmUrl}/api/v4/projects/${helmProjectId}/repository`);
    const params = new URLSearchParams(stryMutAct_9fa48("5154") ? {} : (stryCov_9fa48("5154"), {
      ref: stryMutAct_9fa48("5157") ? helmBranch && DEFAULT_BRANCH : stryMutAct_9fa48("5156") ? false : stryMutAct_9fa48("5155") ? true : (stryCov_9fa48("5155", "5156", "5157"), helmBranch || DEFAULT_BRANCH)
    }));
    if (stryMutAct_9fa48("5159") ? false : stryMutAct_9fa48("5158") ? true : (stryCov_9fa48("5158", "5159"), helmPath)) params.append(stryMutAct_9fa48("5160") ? "" : (stryCov_9fa48("5160"), 'path'), helmPath);
    return stryMutAct_9fa48("5161") ? `` : (stryCov_9fa48("5161"), `${url}?${params}`);
  }
};

export const createGitApi = (data: Helm, gitProvider: GitProviders) => {
  if (stryMutAct_9fa48("5162")) {
    {}
  } else {
    stryCov_9fa48("5162");

    if (stryMutAct_9fa48("5165") ? gitProvider !== 'GITHUB' : stryMutAct_9fa48("5164") ? false : stryMutAct_9fa48("5163") ? true : (stryCov_9fa48("5163", "5164", "5165"), gitProvider === (stryMutAct_9fa48("5166") ? "" : (stryCov_9fa48("5166"), 'GITHUB')))) {
      if (stryMutAct_9fa48("5167")) {
        {}
      } else {
        stryCov_9fa48("5167");
        return createGithubApi(data);
      }
    } else {
      if (stryMutAct_9fa48("5168")) {
        {}
      } else {
        stryCov_9fa48("5168");
        return createGitlabApi(data);
      }
    }
  }
};
export const getSearchParams = (url: string) => {
  if (stryMutAct_9fa48("5169")) {
    {}
  } else {
    stryCov_9fa48("5169");

    try {
      if (stryMutAct_9fa48("5170")) {
        {}
      } else {
        stryCov_9fa48("5170");
        return new URL(url).searchParams;
      }
    } catch (e) {
      if (stryMutAct_9fa48("5171")) {
        {}
      } else {
        stryCov_9fa48("5171");
        return new URL(window.location.href).searchParams;
      }
    }
  }
};

const destructGithub = (url: string, setValue: SetValue) => {
  if (stryMutAct_9fa48("5172")) {
    {}
  } else {
    stryCov_9fa48("5172");
    const params = getSearchParams(url);
    const splitProtocol = url.split(stryMutAct_9fa48("5173") ? "" : (stryCov_9fa48("5173"), '//'));
    const splitUrl = stryMutAct_9fa48("5174") ? splitProtocol[1].split('/') : (stryCov_9fa48("5174"), splitProtocol[1]?.split(stryMutAct_9fa48("5175") ? "" : (stryCov_9fa48("5175"), '/')));
    const reposPosition = stryMutAct_9fa48("5176") ? splitUrl.indexOf('repos') : (stryCov_9fa48("5176"), splitUrl?.indexOf(stryMutAct_9fa48("5177") ? "" : (stryCov_9fa48("5177"), 'repos')));
    const baseUrl = stryMutAct_9fa48("5179") ? splitUrl.slice(0, reposPosition)?.join("/") : stryMutAct_9fa48("5178") ? splitUrl?.slice(0, reposPosition).join("/") : (stryCov_9fa48("5178", "5179"), splitUrl?.slice(0, reposPosition)?.join(stryMutAct_9fa48("5180") ? "" : (stryCov_9fa48("5180"), "/")));
    const helmUrl = stryMutAct_9fa48("5181") ? `` : (stryCov_9fa48("5181"), `${stryMutAct_9fa48("5182") ? splitProtocol[0] : (stryCov_9fa48("5182"), splitProtocol?.[0])}//${baseUrl}`);
    const organization = stryMutAct_9fa48("5183") ? splitUrl[reposPosition + 1] : (stryCov_9fa48("5183"), splitUrl?.[stryMutAct_9fa48("5184") ? reposPosition - 1 : (stryCov_9fa48("5184"), reposPosition + 1)]);
    const repository = stryMutAct_9fa48("5185") ? splitUrl[reposPosition + 2] : (stryCov_9fa48("5185"), splitUrl?.[stryMutAct_9fa48("5186") ? reposPosition - 2 : (stryCov_9fa48("5186"), reposPosition + 2)]);
    let path = stryMutAct_9fa48("5187") ? "Stryker was here!" : (stryCov_9fa48("5187"), '');

    if (stryMutAct_9fa48("5190") ? splitUrl[reposPosition + 4] : stryMutAct_9fa48("5189") ? false : stryMutAct_9fa48("5188") ? true : (stryCov_9fa48("5188", "5189", "5190"), splitUrl?.[stryMutAct_9fa48("5191") ? reposPosition - 4 : (stryCov_9fa48("5191"), reposPosition + 4)])) {
      if (stryMutAct_9fa48("5192")) {
        {}
      } else {
        stryCov_9fa48("5192");
        path = stryMutAct_9fa48("5193") ? splitUrl[reposPosition + 4].split('?')[0] : (stryCov_9fa48("5193"), splitUrl?.[stryMutAct_9fa48("5194") ? reposPosition - 4 : (stryCov_9fa48("5194"), reposPosition + 4)].split(stryMutAct_9fa48("5195") ? "" : (stryCov_9fa48("5195"), '?'))[0]);
      }
    }

    const branch = params.get(stryMutAct_9fa48("5196") ? "" : (stryCov_9fa48("5196"), 'ref'));
    setValue(stryMutAct_9fa48("5197") ? "" : (stryCov_9fa48("5197"), 'helmUrl'), helmUrl, stryMutAct_9fa48("5198") ? {} : (stryCov_9fa48("5198"), {
      shouldValidate: stryMutAct_9fa48("5199") ? false : (stryCov_9fa48("5199"), true)
    }));
    setValue(stryMutAct_9fa48("5200") ? "" : (stryCov_9fa48("5200"), 'helmOrganization'), organization, stryMutAct_9fa48("5201") ? {} : (stryCov_9fa48("5201"), {
      shouldValidate: stryMutAct_9fa48("5202") ? false : (stryCov_9fa48("5202"), true)
    }));
    setValue(stryMutAct_9fa48("5203") ? "" : (stryCov_9fa48("5203"), 'helmRepository'), repository, stryMutAct_9fa48("5204") ? {} : (stryCov_9fa48("5204"), {
      shouldValidate: stryMutAct_9fa48("5205") ? false : (stryCov_9fa48("5205"), true)
    }));
    setValue(stryMutAct_9fa48("5206") ? "" : (stryCov_9fa48("5206"), 'helmBranch'), branch, stryMutAct_9fa48("5207") ? {} : (stryCov_9fa48("5207"), {
      shouldValidate: stryMutAct_9fa48("5208") ? false : (stryCov_9fa48("5208"), true)
    }));
    setValue(stryMutAct_9fa48("5209") ? "" : (stryCov_9fa48("5209"), 'helmPath'), path, stryMutAct_9fa48("5210") ? {} : (stryCov_9fa48("5210"), {
      shouldValidate: stryMutAct_9fa48("5211") ? false : (stryCov_9fa48("5211"), true)
    }));
  }
};

const destructGitlab = (url: string, setValue: SetValue) => {
  if (stryMutAct_9fa48("5212")) {
    {}
  } else {
    stryCov_9fa48("5212");
    const params = getSearchParams(url);
    const baseUrlFind = stryMutAct_9fa48("5213") ? "" : (stryCov_9fa48("5213"), '/api/v4/projects');
    const baseUrlLocation = url.indexOf(baseUrlFind);
    const baseUrl = stryMutAct_9fa48("5214") ? url.slice(0, baseUrlLocation) : (stryCov_9fa48("5214"), url?.slice(0, baseUrlLocation));
    const leftInfo = stryMutAct_9fa48("5215") ? url.slice(baseUrlLocation + baseUrlFind.length + 1) : (stryCov_9fa48("5215"), url?.slice(stryMutAct_9fa48("5216") ? baseUrlLocation + baseUrlFind.length - 1 : (stryCov_9fa48("5216"), (stryMutAct_9fa48("5217") ? baseUrlLocation - baseUrlFind.length : (stryCov_9fa48("5217"), baseUrlLocation + baseUrlFind.length)) + 1)));
    const infoSplit = stryMutAct_9fa48("5218") ? leftInfo.split('/') : (stryCov_9fa48("5218"), leftInfo?.split(stryMutAct_9fa48("5219") ? "" : (stryCov_9fa48("5219"), '/')));
    const projectId = stryMutAct_9fa48("5220") ? infoSplit[0] : (stryCov_9fa48("5220"), infoSplit?.[0]);
    const branch = params.get(stryMutAct_9fa48("5221") ? "" : (stryCov_9fa48("5221"), 'ref'));
    const path = params.get(stryMutAct_9fa48("5222") ? "" : (stryCov_9fa48("5222"), 'path'));
    setValue(stryMutAct_9fa48("5223") ? "" : (stryCov_9fa48("5223"), 'helmUrl'), baseUrl, stryMutAct_9fa48("5224") ? {} : (stryCov_9fa48("5224"), {
      shouldValidate: stryMutAct_9fa48("5225") ? false : (stryCov_9fa48("5225"), true)
    }));
    setValue(stryMutAct_9fa48("5226") ? "" : (stryCov_9fa48("5226"), 'helmProjectId'), projectId, stryMutAct_9fa48("5227") ? {} : (stryCov_9fa48("5227"), {
      shouldValidate: stryMutAct_9fa48("5228") ? false : (stryCov_9fa48("5228"), true)
    }));
    setValue(stryMutAct_9fa48("5229") ? "" : (stryCov_9fa48("5229"), 'helmBranch'), branch, stryMutAct_9fa48("5230") ? {} : (stryCov_9fa48("5230"), {
      shouldValidate: stryMutAct_9fa48("5231") ? false : (stryCov_9fa48("5231"), true)
    }));
    setValue(stryMutAct_9fa48("5232") ? "" : (stryCov_9fa48("5232"), 'helmPath'), path, stryMutAct_9fa48("5233") ? {} : (stryCov_9fa48("5233"), {
      shouldValidate: stryMutAct_9fa48("5234") ? false : (stryCov_9fa48("5234"), true)
    }));
  }
};

export const destructHelmUrl = (url: string, gitProvider: GitProviders, setValue: SetValue) => {
  if (stryMutAct_9fa48("5235")) {
    {}
  } else {
    stryCov_9fa48("5235");

    if (stryMutAct_9fa48("5238") ? gitProvider !== 'GITHUB' : stryMutAct_9fa48("5237") ? false : stryMutAct_9fa48("5236") ? true : (stryCov_9fa48("5236", "5237", "5238"), gitProvider === (stryMutAct_9fa48("5239") ? "" : (stryCov_9fa48("5239"), 'GITHUB')))) {
      if (stryMutAct_9fa48("5240")) {
        {}
      } else {
        stryCov_9fa48("5240");
        return destructGithub(url, setValue);
      }
    } else {
      if (stryMutAct_9fa48("5241")) {
        {}
      } else {
        stryCov_9fa48("5241");
        return destructGitlab(url, setValue);
      }
    }
  }
};
export const findGitProvider = (url: string) => {
  if (stryMutAct_9fa48("5242")) {
    {}
  } else {
    stryCov_9fa48("5242");

    if (stryMutAct_9fa48("5244") ? false : stryMutAct_9fa48("5243") ? true : (stryCov_9fa48("5243", "5244"), url.includes(stryMutAct_9fa48("5245") ? "" : (stryCov_9fa48("5245"), 'github')))) {
      if (stryMutAct_9fa48("5246")) {
        {}
      } else {
        stryCov_9fa48("5246");
        return githubProvider;
      }
    } else {
      if (stryMutAct_9fa48("5247")) {
        {}
      } else {
        stryCov_9fa48("5247");
        return gitlabProvider;
      }
    }
  }
};
export const validateSlash = (input: string, name: string) => {
  if (stryMutAct_9fa48("5248")) {
    {}
  } else {
    stryCov_9fa48("5248");

    if (stryMutAct_9fa48("5251") ? input[0] !== "/" : stryMutAct_9fa48("5250") ? false : stryMutAct_9fa48("5249") ? true : (stryCov_9fa48("5249", "5250", "5251"), input[0] === (stryMutAct_9fa48("5252") ? "" : (stryCov_9fa48("5252"), "/")))) {
      if (stryMutAct_9fa48("5253")) {
        {}
      } else {
        stryCov_9fa48("5253");
        return stryMutAct_9fa48("5254") ? `` : (stryCov_9fa48("5254"), `the ${name} field should not start with "/"`);
      }
    } else if (stryMutAct_9fa48("5257") ? input.slice(-1) !== "/" : stryMutAct_9fa48("5256") ? false : stryMutAct_9fa48("5255") ? true : (stryCov_9fa48("5255", "5256", "5257"), input.slice(stryMutAct_9fa48("5258") ? +1 : (stryCov_9fa48("5258"), -1)) === (stryMutAct_9fa48("5259") ? "" : (stryCov_9fa48("5259"), "/")))) {
      if (stryMutAct_9fa48("5260")) {
        {}
      } else {
        stryCov_9fa48("5260");
        return stryMutAct_9fa48("5261") ? `` : (stryCov_9fa48("5261"), `the ${name} field should not ends with "/"`);
      }
    }

    return stryMutAct_9fa48("5262") ? false : (stryCov_9fa48("5262"), true);
  }
};
export const getHelmFieldsValidations = stryMutAct_9fa48("5263") ? () => undefined : (stryCov_9fa48("5263"), (() => {
  const getHelmFieldsValidations = (name: string, required = stryMutAct_9fa48("5264") ? false : (stryCov_9fa48("5264"), true)) => stryMutAct_9fa48("5265") ? {} : (stryCov_9fa48("5265"), {
    required: required ? isRequired() : null,
    validate: stryMutAct_9fa48("5266") ? {} : (stryCov_9fa48("5266"), {
      validSlash: stryMutAct_9fa48("5267") ? () => undefined : (stryCov_9fa48("5267"), (value: string) => validateSlash(value, name)),
      notBlank: isNotBlank
    }),
    setValueAs: trimValue
  });

  return getHelmFieldsValidations;
})());