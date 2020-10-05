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

import React, { useEffect } from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import { useGlobalState } from 'core/state/hooks';
import routes from 'core/constants/routes';
import { isRoot, hasPermission } from 'core/utils/auth';
import { useWorkspace } from 'modules/Settings/hooks';
import { getWorkspaceId } from 'core/utils/workspace';
import { isAllowed } from './helpers';

export interface Props extends RouteProps {
  allowedRoles: string[];
  allowedRoute?: boolean;
}

const PrivateRoute = ({
  component: Component,
  allowedRoles,
  allowedRoute = false,
  ...rest
}: Props) => {
  const workspaceId = getWorkspaceId();
  const [, loadWorkspace] = useWorkspace();
  const { item: workspace, status } = useGlobalState(
    ({ workspaces }) => workspaces
  );

  useEffect(() => {
    if (
      workspaceId &&
      hasPermission('maintenance_write') &&
      (status === 'idle' ||
        (status !== 'pending' && workspaceId !== workspace?.id))
    ) {
      loadWorkspace(workspaceId);
    }
  }, [workspaceId, loadWorkspace, status, workspace]);

  const isAuthorizedByUser =
    allowedRoute || isAllowed(allowedRoles) || isRoot();

  return (
    <Route
      {...rest}
      render={props =>
        isAuthorizedByUser ? (
          <Component {...props} />
        ) : (
          <Redirect to={routes.error403} />
        )
      }
    />
  );
};

export default PrivateRoute;
