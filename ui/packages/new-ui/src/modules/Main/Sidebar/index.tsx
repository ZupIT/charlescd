import React from 'react';
import { logout } from 'core/utils/auth';
import { ExpandClick } from './Types';
import MenuItems from './MenuItems';
import Styled from './styled';

interface Props {
  isExpanded: boolean;
  onClickExpand: (state: ExpandClick) => void;
}

const Sidebar = ({ isExpanded, onClickExpand }: Props) => (
  <Styled.Nav data-testid="sidebar">
    <a href="/">
      <Styled.Logo name="charles" size="37px" />
    </a>

    <MenuItems
      isExpanded={isExpanded}
      expandMenu={(state: ExpandClick) => onClickExpand(state)}
    />
    <Styled.Bottom.Actions>
      <Styled.Bottom.Button onClick={logout}>
        <Styled.Icon name="logout" size="15px" />
      </Styled.Bottom.Button>
    </Styled.Bottom.Actions>
  </Styled.Nav>
);

export default Sidebar;
