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
const v2 = '/v2';

const auth = `${v2}/auth`;
const login = `${auth}/login`;

const workspaces = `${v2}/workspaces`;

const users = `${v2}/users`;
const usersComparation = `${v2}/users/compare`;

const usersView = `${v1}/settings/permissions/users`;
const usersCreate = `${v2}/users/create`;

const workspace = `${v2}/workspace`;
const circles = `${v2}/circles`;
const hypotheses = `${v2}/hypotheses`;
const hypothesesEdit = `${v2}/hypotheses/:hypothesisId`;
const hypothesesCard = `${v2}/hypotheses/:hypothesisId/card/:cardId`;
const modules = `${v2}/modules`;
const modulesComparation = `${modules}/compare`;
const settings = `${v2}/settings`;
const credentials = `${settings}/credentials`;

const groups = `${v2}/groups`;
const groupsShow = `${groups}/show`;
const groupsCreate = `${groups}/create`;
const groupsEdit = `${groups}/edit/:id`;

const account = `${v2}/account`;
const accountProfile = `${account}/profile`;

const error = `${v2}/error`;
const error403 = `${error}/403`;
const error404 = `${error}/404`;

const circlesComparation = `${circles}/compare`;
const circlesMetrics = `${circles}/metrics`;
const circlesCreate = `${v1}/dashboard/circles/add`;
const circlesEdit = `${v1}/dashboard/circles/:circleId/edit`;
const workspacesComparation = `${workspace}/compare`;

export default {
  main,
  v2,
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
  hypothesesCard
};
