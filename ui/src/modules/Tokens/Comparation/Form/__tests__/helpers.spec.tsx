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

import { Helm } from "modules/Modules/interfaces/Helm";
import { githubProvider, gitlabProvider } from "modules/Settings/Credentials/Sections/CDConfiguration/constants";
import { validFields, createGitApi, destructHelmUrl, getHelmFieldsValidations } from "../helpers"

const invalidEmptyStringObject: Record<string, any> = {
  key1: "",
};

const invalidNullObject: Record<string, any> = {
  key1: undefined
};

const validObject: Record<string, any> = {
  key1: "fake-value",
};

test("empty strings validFields", () => {
  const objectIsValid = validFields(invalidEmptyStringObject)

  expect(objectIsValid).toBeFalsy()
});

test("undefined validFields", () => {
  const objectIsValid = validFields(invalidEmptyStringObject)

  expect(objectIsValid).toBeFalsy()
});

test("valid string validFields", () => {
  const objectIsValid = validFields(validObject)

  expect(objectIsValid).toBeTruthy()
});

test("createGitApi return github with all data", () => {
  const helmData: Helm = {
    helmBranch: "main",
    helmOrganization: "zupit",
    helmPath: "examplepath",
    helmRepository: "examplerepo"
  }

  const githubApi = createGitApi(helmData, githubProvider)
  expect(githubApi).toBe("https://api.github.com/repos/zupit/examplerepo/contents/examplepath?ref=main")
})

test("createGitHubApi return github without path", () => {
  const helmData: Helm = {
    helmBranch: "main",
    helmOrganization: "zupit",
    helmRepository: "examplerepo"
  }

  const githubApi = createGitApi(helmData, githubProvider)
  expect(githubApi).toBe("https://api.github.com/repos/zupit/examplerepo/contents?ref=main")
})

test("createGitApi return github without branch", () => {
  const helmData: Helm = {
    helmOrganization: "zupit",
    helmRepository: "examplerepo"
  }

  const githubApi = createGitApi(helmData, githubProvider)
  expect(githubApi).toBe("https://api.github.com/repos/zupit/examplerepo/contents?ref=main")
})

test("createGitApi return gitlab with all data", () => {
  const helmData: Helm = {
    helmBranch: "main",
    helmOrganization: "zupit",
    helmPath: "examplepath",
    helmRepository: "examplerepo",
    helmGitlabUrl: "https://examplegitlab.com"
  }

  const gitlabApi = createGitApi(helmData, gitlabProvider)
  expect(gitlabApi).toBe("https://examplegitlab.com/api/v4/projects/zupit%2Fexamplerepo/repository/files/examplepath?ref=main")
})

test("createGitLabApi return github without path", () => {
  const helmData: Helm = {
    helmBranch: "main",
    helmOrganization: "zupit",
    helmRepository: "examplerepo",
    helmGitlabUrl: "https://examplegitlab.com"

  }

  const gitlabApi = createGitApi(helmData, gitlabProvider)
  expect(gitlabApi).toBe("https://examplegitlab.com/api/v4/projects/zupit%2Fexamplerepo/repository/files?ref=main")
})

test("createGitApi return github without branch", () => {
  const helmData: Helm = {
    helmOrganization: "zupit",
    helmRepository: "examplerepo",
    helmGitlabUrl: "https://examplegitlab.com"
  }

  const gitlabApi = createGitApi(helmData, gitlabProvider)
  expect(gitlabApi).toBe("https://examplegitlab.com/api/v4/projects/zupit%2Fexamplerepo/repository/files?ref=main")
})

test("destructHelmUrl github with full url", () => {
  const setValue = jest.fn()
  const fullUrl = "https://api.github.com/repos/zupit/examplerepo/contents/examplepath?ref=main"

  destructHelmUrl(fullUrl, githubProvider, setValue)
  expect(setValue).toHaveBeenCalledWith("helmOrganization", "zupit")
  expect(setValue).toHaveBeenCalledWith("helmRepository", "examplerepo")
  expect(setValue).toHaveBeenCalledWith("helmPath", "examplepath")
  expect(setValue).toHaveBeenCalledWith("helmBranch", "main")
})

test("destructHelmUrl github without path", () => {
  const setValue = jest.fn()
  const fullUrl = "https://api.github.com/repos/zupit/examplerepo/contents?ref=main"

  destructHelmUrl(fullUrl, githubProvider, setValue)
  expect(setValue).toHaveBeenCalledWith("helmOrganization", "zupit")
  expect(setValue).toHaveBeenCalledWith("helmRepository", "examplerepo")
  expect(setValue).toHaveBeenCalledWith("helmBranch", "main")
})


test("destructHelmUrl gitlab with full url", () => {
  const setValue = jest.fn()
  const fullUrl = "https://examplegitlab.com/api/v4/projects/zupit%2Fexamplerepo/repository/files/examplepath?ref=main"

  destructHelmUrl(fullUrl, gitlabProvider, setValue)
  expect(setValue).toHaveBeenCalledWith("helmOrganization", "zupit")
  expect(setValue).toHaveBeenCalledWith("helmRepository", "examplerepo")
  expect(setValue).toHaveBeenCalledWith("helmPath", "examplepath")
  expect(setValue).toHaveBeenCalledWith("helmBranch", "main")
  expect(setValue).toHaveBeenCalledWith("helmGitlabUrl", "https://examplegitlab.com")
  expect(setValue).toBeCalledTimes(5)
})

test("destructHelmUrl github without path", () => {
  const setValue = jest.fn()
  const fullUrl = "https://examplegitlab.com/api/v4/projects/zupit%2Fexamplerepo/repository/files?ref=main"

  destructHelmUrl(fullUrl, gitlabProvider, setValue)
  expect(setValue).toHaveBeenCalledWith("helmOrganization", "zupit")
  expect(setValue).toHaveBeenCalledWith("helmRepository", "examplerepo")
  expect(setValue).toHaveBeenCalledWith("helmBranch", "main")
  expect(setValue).toBeCalledTimes(4)
});

test('should retun validation with required true', () => {
  const result = getHelmFieldsValidations('some name');

  expect(result.required).toHaveProperty('value', true);
  expect(result.required).toHaveProperty('message', 'This field is required');
});

test('should retun validation with required false', () => {
  const result = getHelmFieldsValidations('some name', false);
  expect(result.required).toBe(null);
});