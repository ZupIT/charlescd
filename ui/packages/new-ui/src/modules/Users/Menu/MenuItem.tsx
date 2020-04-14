import React, { memo } from 'react';
import Text from 'core/components/Text';
import Styled from './styled';
import routes from 'core/constants/routes';

interface Props {
  email: string;
  name: string;
  id: string;
}

const MenuItem = ({ id, email, name }: Props) => {
  const encodeEmail = btoa(email);

  return (
    <Styled.Link href={`${routes.openedUsers}/${id}/${encodeEmail}/groups`}>
      <Styled.ListItem icon="user" marginContent="8px">
        <Text.h4 color="light">{name}</Text.h4>
      </Styled.ListItem>
    </Styled.Link>
  );
};

export default memo(MenuItem);
