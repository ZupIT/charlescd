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

export const WizardItems = [
  {
    icon: "workspaces",
    name: "Welcome",
    title: "Welcome!",
    backgroundColor: "welcome",
    subtitle:
      "To start using the workspace it is necessary to make some configurations. Click next and see the credentials we need to get started."
  },
  {
    icon: "user-group",
    name: "User group",
    title: "User group",
    backgroundColor: "userGroup",
    subtitle:
      "You can link one or more groups to a workspace. When linking a group you will be asked what permissions it will have on this workspace."
  },
  {
    icon: "hypotheses",
    name: "Git",
    title: "Git",
    backgroundColor: "git",
    subtitle:
      "Adding a Git allows Charles to create, delete and merge branches as well as view repositories and generate releases. "
  },
  {
    icon: "modules",
    name: "Registry",
    title: "Registry",
    backgroundColor: "registry",
    subtitle:
      "Adding your Docker Registry allows Charles to watch for new images being generated and list all the images saved in your registry in order to deploy them. "
  },
  {
    icon: "circles",
    name: "CD configuration",
    title: "CD configuration",
    backgroundColor: "cdConfig",
    subtitle:
      "Add your Continuous Deployment (CD) tool allows Charles to deploy artifacts and manage resources inside your Kubernetes cluster."
  },
  {
    icon: "circle-matcher",
    name: "Circle matcher",
    title: "Circle matcher",
    backgroundColor: "circleMatcher",
    subtitle:
      "Adding URL of our tool helps Charles to identify the user since this can vary from workspace to another. "
  },
  {
    icon: "metrics",
    name: "Metrics provider",
    title: "Metrics provider",
    backgroundColor: "metricsProvider",
    subtitle:
      "Adding the URL of our tool helps Charles to metrics generation since this can vary from workspace to another."
  }
];
