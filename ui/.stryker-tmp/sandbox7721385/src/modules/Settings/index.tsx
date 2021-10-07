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

import { lazy, useEffect, useState, useCallback } from 'react';
import { Route, Switch } from 'react-router-dom';
import Page from 'core/components/Page';
import Placeholder from 'core/components/Placeholder';
import ModalWizard from 'core/components/Modal/Wizard';
import PrivateRoute from 'containers/PrivateRoute';
import routes from 'core/constants/routes';
import { getProfileByKey } from 'core/utils/profile';
import isEmpty from 'lodash/isEmpty';
import Menu from './Menu';
import { SettingsMenu } from './constants';
import { getWizardByUser, setWizard } from './helpers';
import { WORKSPACE_STATUS } from 'modules/Workspaces/enums';
import useWorkspace from './hooks';
import { getWorkspaceId } from 'core/utils/workspace';

const Credentials = lazy(() => import('modules/Settings/Credentials'));

const Settings = () => {
  const profileName = getProfileByKey('name');
  const [showWizard, setShowWizard] = useState(false);
  const hasWizard = !isEmpty(getWizardByUser().email);
  const [isVeteranUser, setIsVeteranUser] = useState<boolean>(hasWizard);
  const {
    getWorkspace,
    data: { workspace, status },
  } = useWorkspace();

  useEffect(() => {
    if (status === 'idle') {
      getWorkspace(getWorkspaceId());
    }
  }, [getWorkspace, status]);

  const onCloseWizard = (enabledWizard: boolean) => {
    setWizard(enabledWizard);
    setIsVeteranUser(true);
    setShowWizard(false);
  };

  const onChangeWorkspace = useCallback(() => {
    getWorkspace(getWorkspaceId());
  }, [getWorkspace]);

  const showWizardModal =
    (!isVeteranUser && workspace?.status === WORKSPACE_STATUS.INCOMPLETE) ||
    showWizard;

  return (
    <Page>
      {showWizardModal && <ModalWizard onClose={onCloseWizard} />}
      <Page.Menu>
        <Menu items={SettingsMenu} />
      </Page.Menu>
      <Page.Content>
        <Switch>
          <PrivateRoute
            path={routes.credentials}
            render={() => (
              <Credentials
                onChangeWorkspace={onChangeWorkspace}
                onClickHelp={() => setShowWizard(true)}
              />
            )}
            allowedRoles={['maintenance_write']}
          />
          <Route>
            <Placeholder
              icon="placeholder-settings"
              title={`Hello, ${profileName}!`}
              subtitle="You need to set up your workspace in the side menu to use Charles."
            />
          </Route>
        </Switch>
      </Page.Content>
    </Page>
  );
};

export default Settings;
