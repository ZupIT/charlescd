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

import React, { useEffect, useState } from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import routes from 'core/constants/routes';
import { isRoot } from 'core/utils/auth';
import { useWorkspace } from 'modules/Settings/hooks';
import { getWorkspaceId } from 'core/utils/workspace';
import { isAllowed } from './helpers';
import { WORKSPACE_STATUS } from 'modules/Workspaces/enums';

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
  const [workspace, loadWorkspace] = useWorkspace();
  const [isAuthorizedByWorkspace, setIsAuthorizedByWorkspace] = useState(true);

  useEffect(() => {
    loadWorkspace(workspaceId);
  }, [workspaceId, loadWorkspace]);

  useEffect(() => {
    if (workspace) {
      setIsAuthorizedByWorkspace(
        workspace?.status === WORKSPACE_STATUS.COMPLETE
      );
    }
  }, [workspace]);

  const isAuthorizedByUser =
    (isRoot() || isAllowed(allowedRoles)) && allowedRoute;

  return (
    <Route
      {...rest}
      render={props =>
        isAuthorizedByWorkspace ? (
          <Component {...props} />
        ) : isAuthorizedByUser ? (
          <Component {...props} />
        ) : (
          <Redirect to={routes.error403} />
        )
      }
    />
  );
};

export default PrivateRoute;
