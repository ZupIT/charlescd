import React from 'react';
import map from 'lodash/map';
import Text from 'core/components/Text';
import LabeledIcon from 'core/components/LabeledIcon';
import Menu from 'core/components/Menu';
import routes from 'core/constants/routes';
import { CirclePaginationItem } from '../interfaces/CirclesPagination';
import { menuFilterItems } from '../constants';
import { CIRCLE_STATUS } from '../hooks';
import MenuItem from './MenuItem';
import Loader from './Loaders';
import Styled from './styled';

interface Props {
  items: CirclePaginationItem[];
  status: string;
  onSearch: (name: string) => void;
  onSelect: (selected: string) => void;
  isLoading: boolean;
}

const CirclesFilter = ({
  items,
  status,
  onSearch,
  onSelect,
  isLoading
}: Props) => {
  const renderItems = () =>
    map(items, ({ id, name }: CirclePaginationItem) => (
      <MenuItem key={id} id={id} name={name} />
    ));

  const circleStatus = status === CIRCLE_STATUS.active ? 'Active' : 'Inactive';

  return (
    <>
      <Styled.Actions>
        <Styled.A href={routes.circlesCreate}>
          <LabeledIcon icon="plus-circle" marginContent="5px">
            <Text.h5 color="dark">Create circle</Text.h5>
          </LabeledIcon>
        </Styled.A>
        <Menu actions={menuFilterItems} active={status} onSelect={onSelect}>
          <LabeledIcon icon="filter" marginContent="5px">
            <Text.h5 color="dark">{circleStatus}</Text.h5>
          </LabeledIcon>
        </Menu>
        <Styled.A href={routes.circlesMatcher}>
          <Styled.Icon name="circle-matcher" color="dark" />
        </Styled.A>
        <Styled.A href={routes.circles}>
          <Styled.Icon name="activity" color="dark" />
        </Styled.A>
      </Styled.Actions>
      <Styled.SearchInput resume onSearch={onSearch} />
      <Styled.Content>
        <Styled.List>{isLoading ? <Loader.List /> : renderItems()}</Styled.List>
      </Styled.Content>
    </>
  );
};

export default CirclesFilter;
