import React, { useState, useEffect } from 'react';
import { getProfileByKey } from 'core/utils/profile';
import Page from 'core/components/Page';
import Icon from 'core/components/Icon';
import Text from 'core/components/Text';
import { useGlobalState } from 'core/state/hooks';
import useWorkspace from './hooks';
import Styled from './styled';
import Menu from './Menu';

const Placeholder = () => {
  const profileName = getProfileByKey('name');

  return (
    <>
      <Styled.Wrapper>
        <Icon name="empty-workspaces" />
      </Styled.Wrapper>
      <Styled.Empty>
        <Text.h1 color="light" align="center">
          Hello, {profileName}!
        </Text.h1>
        <Text.h1 color="light" align="center">
          You need to select a workspace in the side menu to get started.
        </Text.h1>
      </Styled.Empty>
    </>
  );
};

const Workspace = () => {
  const [filterWorkspace] = useWorkspace();
  const [name, setName] = useState('');
  const { list } = useGlobalState(({ workspaces }) => workspaces);

  useEffect(() => {
    filterWorkspace(name);
  }, [name, filterWorkspace]);

  return (
    <Page>
      <Page.Menu>
        <Menu items={list?.content} onSearch={setName} />
      </Page.Menu>
      <Page.Content>
        <Placeholder />
      </Page.Content>
    </Page>
  );
};

export default Workspace;
