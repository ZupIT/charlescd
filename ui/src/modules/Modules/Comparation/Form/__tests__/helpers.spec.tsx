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
import { validFields, createGitApi, destructHelmUrl } from "../helpers"

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

// test("should createGitApi return github with all data", () => {
//   const helmData: Helm = {
//     helmBranch: "main",
//     helmOrganization: "zupit",
//     helmPath: "examplepath",
//     helmRepository: "examplerepo"
//   }

//   const githubApi = createGitApi(helmData, githubProvider)
//   expect(githubApi).toBe("https://api.github.com/repos/zupit/examplerepo/contents/examplepath?ref=main")
// })

// test("createGitApi return github without path", () => {
//   const helmData: Helm = {
//     helmBranch: "main",
//     helmOrganization: "zupit",
//     helmRepository: "examplerepo"
//   }

//   const githubApi = createGitApi(helmData, githubProvider)
//   expect(githubApi).toBe("https://api.github.com/repos/zupit/examplerepo/contents?ref=main")
// })

// test("should createGitApi return github without branch", () => {
//   const helmData: Helm = {
//     helmOrganization: "zupit",
//     helmRepository: "examplerepo"
//   }

//   const githubApi = createGitApi(helmData, githubProvider)
//   expect(githubApi).toBe("https://api.github.com/repos/zupit/examplerepo/contents?ref=main")
// })

// test("should createGitApi return gitlab with all data", () => {
//   const helmData: Helm = {
//     helmBranch: "main",
//     helmOrganization: "zupit",
//     helmPath: "examplepath",
//     helmRepository: "examplerepo",
//     helmGitlabUrl: "https://gitlab.com"
//   }

//   const gitlabApi = createGitApi(helmData, gitlabProvider)
//   expect(gitlabApi).toBe("https://gitlab.com/api/v4/projects/zupit%2Fexamplerepo/repository/files/examplepath?ref=main")
// })

// test("should createGitApi return gitlab without path", () => {
//   const helmData: Helm = {
//     helmBranch: "main",
//     helmOrganization: "zupit",
//     helmRepository: "examplerepo",
//     helmGitlabUrl: "https://gitlab.com"

//   }

//   const gitlabApi = createGitApi(helmData, gitlabProvider)
//   expect(gitlabApi).toBe("https://gitlab.com/api/v4/projects/zupit%2Fexamplerepo/repository/files?ref=main")
// })

test("should createGitApi return gitlab without branch", () => {
  const helmData: Helm = {
    helmOrganization: "zupit",
    helmProjectId: "123456",
    helmUrl: "https://gitlab.com"
  }

  const gitlabApi = createGitApi(helmData, gitlabProvider)
  expect(gitlabApi).toBe("https://gitlab.com/api/v4/projects/123456/repository?ref=main")
})

test("destructHelmUrl github with full url", () => {
  const setValue = jest.fn()
  const fullUrl = "https://api.github.com/repos/zupit/examplerepo/contents/examplepath&ref=main"

  destructHelmUrl(fullUrl, githubProvider, setValue)
  expect(setValue).toHaveBeenCalledWith("helmUrl", "https://api.github.com", {"shouldValidate": true});
  expect(setValue).toHaveBeenCalledWith("helmOrganization", "zupit", {"shouldValidate": true});
  expect(setValue).toHaveBeenCalledWith("helmRepository", "examplerepo", {"shouldValidate": true});
  // expect(setValue).toHaveBeenCalledWith("helmPath", "examplepath", {"shouldValidate": true})
  // expect(setValue).toHaveBeenCalledWith("helmBranch", "main", {"shouldValidate": true})
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
