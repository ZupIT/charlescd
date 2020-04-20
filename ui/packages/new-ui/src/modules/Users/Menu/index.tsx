import React from 'react';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import Text from 'core/components/Text';
import LabeledIcon from 'core/components/LabeledIcon';
import { UserPaginationItem } from '../interfaces/UserPagination';
import MenuItem from './MenuItem';
import Styled from './styled';
import Loader from './Loaders';
import routes from 'core/constants/routes';

interface Props {
  items: UserPaginationItem[];
  onSearch: (name: string) => void;
}

const UserMenu = ({ items, onSearch }: Props) => {
  const renderUsers = () =>
    map(items, ({ id, name, email }: UserPaginationItem) => (
      <MenuItem key={id} id={id} email={email} name={name} />
    ));

  return (
    <>
      <Styled.Actions>
        <Styled.Link href={routes.createUsers}>
          <LabeledIcon icon="plus-circle" marginContent="5px">
            <Text.h5 color="dark">Create User</Text.h5>
          </LabeledIcon>
        </Styled.Link>
      </Styled.Actions>
      <Styled.Content>
        <Styled.SearchInput resume onSearch={onSearch} />
        <Styled.List>
          {isEmpty(items) ? <Loader.List /> : renderUsers()}
        </Styled.List>
      </Styled.Content>
    </>
  );
};

export default UserMenu;
