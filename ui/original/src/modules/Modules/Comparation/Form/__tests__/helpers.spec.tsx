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

import { waitFor } from 'unit-test/testUtils';
import { Helm } from "modules/Modules/interfaces/Helm";
import {
  validFields, createGitApi,
  createGithubApi, destructHelmUrl,
  validateSlash
} from "../helpers"

const githubProvider = 'GITHUB';
const gitlabProvider = 'GITLAB';

const invalidEmptyStringObject: Record<string, any> = {
  key1: "",
};

const validObject: Record<string, any> = {
  key1: "fake-value",
};

test("should empty strings validFields", () => {
  const objectIsValid = validFields(invalidEmptyStringObject)

  expect(objectIsValid).toBeFalsy()
});

test("should undefined validFields", () => {
  const objectIsValid = validFields(invalidEmptyStringObject)

  expect(objectIsValid).toBeFalsy()
});

test("should valid string validFields", () => {
  const objectIsValid = validFields(validObject)

  expect(objectIsValid).toBeTruthy()
});

test("should validateSlash starts with '/'", () => {
  const fieldName = 'field';
  const validated = validateSlash('/github.com', fieldName);

  expect(validated).toBe(`the ${fieldName} field should not start with "/"`);
});

test("should validateSlash ends with '/'", () => {
  const fieldName = 'field';
  const validated = validateSlash('https://github.com/', fieldName);

  expect(validated).toBe(`the ${fieldName} field should not ends with "/"`);
});

test("should createGitApi [gitlab] without branch", () => {
  const helmData: Helm = {
    helmOrganization: "zupit",
    helmProjectId: "123456",
    helmUrl: "https://gitlab.com"
  }

  const gitlabApi = createGitApi(helmData, gitlabProvider)
  expect(gitlabApi).toBe("https://gitlab.com/api/v4/projects/123456/repository?ref=main")
})

test("should createGitApi [github] without branch", () => {
  const helmData: Helm = {
    helmOrganization: "zupit",
    helmRepository: "examplerepo",
    helmUrl: "https://api.github.com"
  }

  const gitlabApi = createGitApi(helmData, githubProvider);
  expect(gitlabApi).toBe("https://api.github.com/repos/zupit/examplerepo/contents?ref=main");
})

test("createGithubApi default", () => {
  const helmData: Helm = {
    helmUrl: 'https://api.github.com',
    helmOrganization: 'zupit',
    helmRepository: 'examplerepo',
    helmPath: '',
    helmBranch: 'main',
  }

  const githubUrl = createGithubApi(helmData);
  expect(githubUrl).toBe("https://api.github.com/repos/zupit/examplerepo/contents?ref=main");
})

test("createGithubApi without branch", () => {
  const helmData: Helm = {
    helmUrl: 'https://api.github.com',
    helmOrganization: 'zupit',
    helmRepository: 'examplerepo',
    helmPath: '',
    helmBranch: '',
  }

  const githubUrl = createGithubApi(helmData);
  expect(githubUrl).toBe("https://api.github.com/repos/zupit/examplerepo/contents?ref=main");
})

test("destructHelmUrl github with full url", () => {
  const setValue = jest.fn()
  const fullUrl = "https://api.github.com/repos/zupit/examplerepo/contents/examplepath?ref=main"

  destructHelmUrl(fullUrl, githubProvider, setValue)
  expect(setValue).toHaveBeenCalledWith("helmUrl", "https://api.github.com", {"shouldValidate": true});
  expect(setValue).toHaveBeenCalledWith("helmOrganization", "zupit", {"shouldValidate": true});
  expect(setValue).toHaveBeenCalledWith("helmRepository", "examplerepo", {"shouldValidate": true});
  waitFor(() => expect(setValue).toHaveBeenCalledWith("helmPath", "examplepath", {"shouldValidate": true}));
  waitFor(() => expect(setValue).toHaveBeenCalledWith("helmBranch", "main", {"shouldValidate": true}));
  expect(setValue).toBeCalledTimes(5);
})

test("destructHelmUrl github without path", () => {
  const setValue = jest.fn()
  const fullUrl = "https://api.github.com/repos/zupit/examplerepo/contents?ref=main"

  destructHelmUrl(fullUrl, githubProvider, setValue)
  expect(setValue).toHaveBeenCalledWith("helmUrl", "https://api.github.com", {"shouldValidate": true});
  expect(setValue).toHaveBeenCalledWith("helmOrganization", "zupit", {"shouldValidate": true});
  expect(setValue).toHaveBeenCalledWith("helmRepository", "examplerepo", {"shouldValidate": true});
  expect(setValue).toHaveBeenCalledWith("helmBranch", "main", {"shouldValidate": true});
  expect(setValue).toBeCalledTimes(5);
})

test("destructHelmUrl gitlab with full url", () => {
  const setValue = jest.fn()
  const fullUrl = "https://gitlab.com/api/v4/projects/123456/repository?path=examplepath&ref=main"

  destructHelmUrl(fullUrl, gitlabProvider, setValue)
  expect(setValue).toHaveBeenCalledWith("helmUrl", "https://gitlab.com", {"shouldValidate": true});
  expect(setValue).toHaveBeenCalledWith("helmProjectId", "123456", {"shouldValidate": true});
  expect(setValue).toHaveBeenCalledWith("helmPath", "examplepath", {"shouldValidate": true});
  expect(setValue).toHaveBeenCalledWith("helmBranch", "main", {"shouldValidate": true});
  expect(setValue).toBeCalledTimes(4);
})

test("destructHelmUrl gitlab without path", () => {
  const setValue = jest.fn()
  const fullUrl = "https://gitlab.com/api/v4/projects/123456/repository?ref=main"

  destructHelmUrl(fullUrl, gitlabProvider, setValue)
  expect(setValue).toHaveBeenCalledWith("helmUrl", "https://gitlab.com", {"shouldValidate": true});
  expect(setValue).toHaveBeenCalledWith("helmProjectId", "123456", {"shouldValidate": true});
  expect(setValue).toHaveBeenCalledWith("helmBranch", "main", {"shouldValidate": true});
  expect(setValue).toBeCalledTimes(4);
})
