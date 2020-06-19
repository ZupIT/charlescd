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
    icon: "empty-workspaces",
    name: "welcome",
    title: "Welcome!",
    backgroundColor: "welcome",
    size: "190px",
    subtitle:
      "To start using the workspace it is necessary to make some configurations. Click next and see the credentials we need to get started."
  },
  {
    icon: "empty-groups",
    name: "user-group",
    title: "User group",
    backgroundColor: "userGroup",
    size: "200px",
    subtitle:
      "You can link one or more groups to a workspace. When linking a group you will be asked what permissions it will have on this workspace."
  },
  {
    icon: "empty-hypothesis",
    name: "git",
    title: "Git",
    backgroundColor: "git",
    size: "200px",
    subtitle:
      "Adding a Git allows Charles to create, delete and merge branches as well as view repositories and generate releases. "
  },
  {
    icon: "empty-modules",
    name: "registry",
    title: "Registry",
    backgroundColor: "registry",
    size: "177px",
    subtitle:
      "Adding your Docker Registry allows Charles to watch for new images being generated and list all the images saved in your registry in order to deploy them. "
  },
  {
    icon: "empty-circles",
    name: "cdConfig",
    title: "CD configuration",
    backgroundColor: "cdConfig",
    size: "220px",
    subtitle:
      "Add your Continuous Deployment (CD) tool allows Charles to deploy artifacts and manage resources inside your Kubernetes cluster."
  },
  {
    icon: "wizard-circle-matcher",
    name: "circle-matcher",
    title: "Circle matcher",
    backgroundColor: "circleMatcher",
    size: "200px",
    subtitle:
      "Adding URL of our tool helps Charles to identify the user since this can vary from workspace to another. "
  },
  {
    icon: "wizard-metrics",
    name: "metrics-provider",
    title: "Metrics provider",
    backgroundColor: "metricsProvider",
    size: "190px",
    subtitle:
      "Adding the URL of our tool helps Charles to metrics generation since this can vary from workspace to another."
  }
];
