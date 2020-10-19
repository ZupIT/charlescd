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

import React, { lazy, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import Page from 'core/components/Page';
import Placeholder from 'core/components/Placeholder';
import Modal from 'core/components/Modal';
import PrivateRoute from 'containers/PrivateRoute';
import routes from 'core/constants/routes';
import { getProfileByKey } from 'core/utils/profile';
import { useGlobalState } from 'core/state/hooks';
import isEmpty from 'lodash/isEmpty';
import Menu from './Menu';
import { SettingsMenu } from './constants';
import { getWizardByUser, setWizard } from './helpers';
import { WORKSPACE_STATUS } from 'modules/Workspaces/enums';

const Credentials = lazy(() => import('modules/Settings/Credentials'));

const Settings = () => {
  const profileName = getProfileByKey('name');
  const { item: workspace } = useGlobalState(({ workspaces }) => workspaces);
  const [showWizard, setShowWizard] = useState(false);
  const hasWizard = !isEmpty(getWizardByUser().email);
  const [isVeteranUser, setIsVeteranUser] = useState<boolean>(hasWizard);

  const onCloseWizard = (enabledWizard: boolean) => {
    setWizard(enabledWizard);
    setIsVeteranUser(true);
    setShowWizard(false);
  };

  const showWizardModal =
    (!isVeteranUser && workspace.status === WORKSPACE_STATUS.INCOMPLETE) ||
    showWizard;

  return (
    <Page>
      {showWizardModal && <Modal.Wizard onClose={onCloseWizard} />}
      <Page.Menu>
        <Menu items={SettingsMenu} />
      </Page.Menu>
      <Page.Content>
        <Switch>
          <PrivateRoute
            path={routes.credentials}
            render={() => (
              <Credentials onClickHelp={() => setShowWizard(true)} />
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
