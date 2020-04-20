import React, { memo } from 'react';
import Text from 'core/components/Text';
import Styled from './styled';
import routes from 'core/constants/routes';

interface Props {
  id: string;
  name: string;
}

const MenuItem = ({ id, name }: Props) => (
  <Styled.Link href={`${routes.openedWorkspace}/${id}`}>
    <Styled.ListItem icon="workspace" marginContent="8px">
      <Text.h4 color="light">{name}</Text.h4>
    </Styled.ListItem>
  </Styled.Link>
);

export default memo(MenuItem);
