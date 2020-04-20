import React from 'react';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import Text from 'core/components/Text';
import LabeledIcon from 'core/components/LabeledIcon';
import { WorkspacePaginationItem } from '../interfaces/WorkspacePagination';
import MenuItem from './MenuItem';
import Styled from './styled';
import Loader from './Loaders';
import routes from 'core/constants/routes';

interface Props {
  items: WorkspacePaginationItem[];
  onSearch: (name: string) => void;
}

const WorkspaceMenu = ({ items, onSearch }: Props) => {
  const renderWorkspaces = () =>
    map(items, ({ id, name }: WorkspacePaginationItem) => (
      <MenuItem key={id} id={id} name={name} />
    ));

  return (
    <>
      <Styled.Actions>
        <Styled.Link href={routes.createWorkspace}>
          <LabeledIcon icon="plus-circle" marginContent="5px">
            <Text.h5 color="dark">Create Workspace</Text.h5>
          </LabeledIcon>
        </Styled.Link>
      </Styled.Actions>
      <Styled.Content>
        <Styled.SearchInput resume onSearch={onSearch} />
        <Styled.List>
          {isEmpty(items) ? <Loader.List /> : renderWorkspaces()}
        </Styled.List>
      </Styled.Content>
    </>
  );
};

export default WorkspaceMenu;
