import { isDevelopmentLegacyHost } from 'core/utils/development';

const basePathV1 = isDevelopmentLegacyHost();
const basePathV2 = '/v2';
const main = '';
const circles = `${basePathV2}/circles`;
const circlesComparation = `${circles}/compare`;
const circlesMetrics = `${circles}/metrics`;
const circlesCreate = `${basePathV1}/dashboard/circles/add`;
const circlesEdit = `${basePathV1}/dashboard/circles/:circleId/edit`;
const circlesMatcher = `${basePathV1}/dashboard/circles/matcher`;
const hypotheses = `${basePathV1}/dashboard/hypotheses`;
const modules = `${basePathV1}/dashboard/modules`;
const settings = `${basePathV2}/settings`;
const groups = `${basePathV1}/settings/permissions/groups`;
const users = `${settings}/users`;
const openedUsers = `${basePathV1}/settings/permissions/users`;
const createUsers = `${basePathV1}/settings/permissions/users/create`;
const workspace = `${settings}/workspace`;
const openedWorkspace = `${basePathV1}/settings/permissions/workspaces`;
const createWorkspace = `${basePathV1}/settings/permissions/workspaces/create`;
const auth = `${basePathV1}/auth`;

const login = `${auth}/login`;

export default {
  basePathV2,
  main,
  circles,
  circlesComparation,
  circlesMetrics,
  circlesCreate,
  circlesEdit,
  circlesMatcher,
  modules,
  settings,
  groups,
  users,
  openedUsers,
  createUsers,
  workspace,
  openedWorkspace,
  createWorkspace,
  auth,
  login,
  hypotheses
};
