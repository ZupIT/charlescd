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

import { FetchStatuses } from 'core/providers/base/hooks';
import { WorkspacePagination } from '../interfaces/WorkspacePagination';
import { Workspace } from '../interfaces/Workspace';
export enum ACTION_TYPES {
  loadedWorkspaces = 'WORKSPACES/LOADED_WORKSPACES',
  loadedWorkspace = 'WORKSPACES/LOADED_WORKSPACE',
  statusWorkspace = 'WORKSPACES/STATUS',
  resetContent = 'WORKSPACES/RESET_CONTENT',
  loadedWorkspacePermissions = 'WORKSPACES/LOADED_WORKSPACE_PERMISSIONS',
}
interface LoadedWorkspacesActionType {
  type: typeof ACTION_TYPES.loadedWorkspaces;
  payload: WorkspacePagination;
}
interface LoadedWorkspaceActionType {
  type: typeof ACTION_TYPES.loadedWorkspace;
  payload: Workspace;
}
interface StatusWorkspaceActionType {
  type: typeof ACTION_TYPES.statusWorkspace;
  payload: FetchStatuses;
}
interface LoadedWorkspacePermissionActionType {
  type: typeof ACTION_TYPES.loadedWorkspacePermissions;
  payload: string[];
}
interface ResetContentActionType {
  type: typeof ACTION_TYPES.resetContent;
}
export const loadedWorkspacesAction = stryMutAct_9fa48("7140") ? () => undefined : (stryCov_9fa48("7140"), (() => {
  const loadedWorkspacesAction = (payload: WorkspacePagination): WorkspacesActionTypes => stryMutAct_9fa48("7141") ? {} : (stryCov_9fa48("7141"), {
    type: ACTION_TYPES.loadedWorkspaces,
    payload
  });

  return loadedWorkspacesAction;
})());
export const loadedWorkspaceAction = stryMutAct_9fa48("7142") ? () => undefined : (stryCov_9fa48("7142"), (() => {
  const loadedWorkspaceAction = (payload: Workspace): WorkspacesActionTypes => stryMutAct_9fa48("7143") ? {} : (stryCov_9fa48("7143"), {
    type: ACTION_TYPES.loadedWorkspace,
    payload
  });

  return loadedWorkspaceAction;
})());
export const loadedWorkspacePermissionsAction = stryMutAct_9fa48("7144") ? () => undefined : (stryCov_9fa48("7144"), (() => {
  const loadedWorkspacePermissionsAction = (payload: string[]): LoadedWorkspacePermissionActionType => stryMutAct_9fa48("7145") ? {} : (stryCov_9fa48("7145"), {
    type: ACTION_TYPES.loadedWorkspacePermissions,
    payload
  });

  return loadedWorkspacePermissionsAction;
})());
export const statusWorkspaceAction = stryMutAct_9fa48("7146") ? () => undefined : (stryCov_9fa48("7146"), (() => {
  const statusWorkspaceAction = (payload: FetchStatuses): WorkspacesActionTypes => stryMutAct_9fa48("7147") ? {} : (stryCov_9fa48("7147"), {
    type: ACTION_TYPES.statusWorkspace,
    payload
  });

  return statusWorkspaceAction;
})());
export const resetContentAction = stryMutAct_9fa48("7148") ? () => undefined : (stryCov_9fa48("7148"), (() => {
  const resetContentAction = (): ResetContentActionType => stryMutAct_9fa48("7149") ? {} : (stryCov_9fa48("7149"), {
    type: ACTION_TYPES.resetContent
  });

  return resetContentAction;
})());
export type WorkspacesActionTypes = LoadedWorkspacesActionType | LoadedWorkspaceActionType | StatusWorkspaceActionType | ResetContentActionType | LoadedWorkspacePermissionActionType;