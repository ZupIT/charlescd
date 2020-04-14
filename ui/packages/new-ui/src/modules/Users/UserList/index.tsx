import React from 'react';
import Text from 'core/components/Text';
import Styled from './styled';
import Icon from 'core/components/Icon';
import { getProfileByKey } from 'core/utils/profile';

const WorkspaceList = () => {
  const profileName = getProfileByKey('name');

  return (
    <>
      <Styled.Warpper>
        <Icon name="empty-workspaces" />
      </Styled.Warpper>
      <Styled.Empty>
        <Text.h1 color="light" align="center">
          Hello, {profileName}!
        </Text.h1>
        <Text.h1 color="light" align="center">
          You need to select a user in the side menu to get started.
        </Text.h1>
      </Styled.Empty>
    </>
  );
};

export default WorkspaceList;
