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

import React, { useState, useEffect, useCallback } from 'react';
import { getProfileByKey } from 'core/utils/profile';
import Page from 'core/components/Page';
import { useGlobalState } from 'core/state/hooks';
import Placeholder from 'core/components/Placeholder';
import { getAccessTokenDecoded, isIDMEnabled, isRoot, logout } from 'core/utils/auth';
import { useWorkspacesByUser } from 'modules/Users/hooks';
import { useWorkspace } from './hooks';
import Menu from './Menu';

interface Props {
  selectedWorkspace: (name: string) => void;
}

const Workspaces = ({ selectedWorkspace }: Props) => {
  const { name: profileName, email } = getAccessTokenDecoded();
  const workspaces = getProfileByKey('workspaces');
  const userId = getProfileByKey('id');
  const [filterWorkspace, , loading] = useWorkspace();
  const { findWorkspacesByUser } = useWorkspacesByUser();
  const [name, setName] = useState('');
  const { list } = useGlobalState(({ workspaces }) => workspaces);

  const onIDMFlow = useCallback(() => {
    if (isRoot()) {
      filterWorkspace();
    } else {
      findWorkspacesByUser(userId);
    }
  }, [filterWorkspace, findWorkspacesByUser, userId]);

  useEffect(() => {
    if (isIDMEnabled()) {
      onIDMFlow();
    }
  }, [onIDMFlow]);

  useEffect(() => {
    if (isRoot()) {
      filterWorkspace(name);
    }
  }, [name, filterWorkspace]);

  useEffect(() => {
    if (!email) logout();
  }, [email]);

  const handleOnSearch = (name: string) => !loading && setName(name);

  return (
    <Page>
      <Page.Menu>
        <Menu
          items={list?.content || workspaces}
          isLoading={loading}
          onSearch={handleOnSearch}
          selectedWorkspace={(name: string) => selectedWorkspace(name)}
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
