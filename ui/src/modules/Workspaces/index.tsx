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
import isEmpty from 'lodash/isEmpty';
import { getProfileByKey } from 'core/utils/profile';
import Page from 'core/components/Page';
import Placeholder from 'core/components/Placeholder';
import { useGlobalState } from 'core/state/hooks';
import { isRoot, logout } from 'core/utils/auth';
import { clearWorkspace } from 'core/utils/workspace';
import { useWorkspace } from './hooks';
import Menu from './Menu';

const Workspaces = () => {
  const profileName = getProfileByKey('name');
  const workspaces = getProfileByKey('workspaces');
  const [filterWorkspace, , loading] = useWorkspace();
  const [name, setName] = useState('');
  const { list } = useGlobalState(({ workspaces }) => workspaces);

  useEffect(() => {
    clearWorkspace();
    if (isEmpty(profileName)) logout();
  }, [profileName]);

  useEffect(() => {
    if (isRoot()) filterWorkspace(name);
  }, [name, filterWorkspace]);

  return (
    <Page>
      <Page.Menu>
        <Menu
          items={list?.content || workspaces}
          isLoading={loading}
          onSearch={setName}
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
