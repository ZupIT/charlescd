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

import { isDevelopmentLegacyHost } from 'core/utils/development';

const main = '/';
const v1 = isDevelopmentLegacyHost();

const auth = `/auth`;
const login = `${auth}/login`;

const workspaces = `/workspaces`;

const users = `/users`;
const usersComparation = `/users/compare`;

const usersView = `${v1}/settings/permissions/users`;
const usersCreate = `/users/create`;

const workspace = `/workspace`;
const circles = `/circles`;
const hypotheses = `/hypotheses`;
const hypothesesEdit = `/hypotheses/:hypothesisId`;
const hypothesesCard = `/hypotheses/:hypothesisId/card/:cardId`;
const modules = `/modules`;
const modulesComparation = `${modules}/compare`;
const metrics = `/metrics`;
const metricsDashboard = `/metrics/dashboard/:id`;
const settings = `/settings`;
const credentials = `${settings}/credentials`;

const groups = `/groups`;
const groupsShow = `${groups}/show`;
const groupsCreate = `${groups}/create`;
const groupsEdit = `${groups}/edit/:id`;

const account = `/account`;
const accountProfile = `${account}/profile`;

const error = `/error`;
const error403 = `${error}/403`;
const error404 = `${error}/404`;

const circlesComparation = `${circles}/compare`;
const circlesMetrics = `${circles}/metrics`;
const circlesCreate = `${v1}/dashboard/circles/add`;
const circlesEdit = `${v1}/dashboard/circles/:circleId/edit`;
const workspacesComparation = `${workspace}/compare`;

export default {
  main,
  auth,
  login,
  error403,
  error404,
  workspace,
  workspaces,
  users,
  usersComparation,
  usersView,
  usersCreate,
  groups,
  groupsShow,
  groupsCreate,
  groupsEdit,
  account,
  accountProfile,
  circles,
  circlesComparation,
  circlesMetrics,
  circlesCreate,
  circlesEdit,
  modules,
  modulesComparation,
  settings,
  credentials,
  workspacesComparation,
  hypotheses,
  hypothesesEdit,
  hypothesesCard,
  metrics,
  metricsDashboard
};
