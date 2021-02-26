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

import React, { useState, useEffect } from 'react';
import Page from 'core/components/Page';
import Placeholder from 'core/components/Placeholder';
import { getAccessTokenDecoded, logout } from 'core/utils/auth';
import { useWorkspaces } from './hooks';
import Menu from './Menu';

const Workspaces = () => {
  const { name: profileName, email } = getAccessTokenDecoded();
  const { getWorkspaces, workspaces, status } = useWorkspaces();
  const [name, setName] = useState('');

  useEffect(() => {
    getWorkspaces(name);
  }, [getWorkspaces, name]);

  useEffect(() => {
    if (!email) logout();
  }, [email]);

  const handleOnSearch = (name: string) => status !== 'pending' && setName(name);

  return (
    <Page>
      <Page.Menu>
        <Menu
          items={workspaces}
          isLoading={status === 'pending'}
          onSearch={handleOnSearch}
        />
      </Page.Menu>
      <Page.Content>
        <Placeholder
          icon="empty-workspaces"
          title={`Hello, ${profileName}!`}
          subtitle="Select or create a workspace in the side menu."
        />
      </Page.Content>
    </Page>
  );
};

export default Workspaces;
