import React from 'react';
import styled, { css } from 'styled-components';
import IconComponent, { Props as IconProps } from 'core/components/Icon';
import Text from 'core/components/Text';

const Nav = styled.nav`
  position: relative;
  grid-area: nav;
  background-color: ${({ theme }) => theme.sidebar.background};
`;

const Footer = styled.div``;

const Logo = styled(IconComponent)`
  display: block;
  margin: 14px 12px 0;
  color: ${({ theme }) => theme.sidebar.icon};
`;

const ExpandButton = styled.button`
  padding: 0;
  border: none;
  cursor: pointer;
  background: none;
`;

const ExpandIcon = styled(IconComponent)`
  padding: 15px 24px;
  color: ${({ theme }) => theme.sidebar.icon};
`;

interface LinkIconProps extends IconProps {
  isActive?: boolean;
}

const LinkIcon = styled((props: LinkIconProps) => {
  const devProps = { ...props };
  delete devProps.isActive;

  return <IconComponent {...devProps} />;
})<LinkProps>`
  margin-right: 10px;
  color: ${({ isActive, theme }) =>
    isActive ? theme.sidebar.menuIconActive : theme.sidebar.menuIcon};
`;

const LinkText = styled(Text.h5)<LinkProps>`
  color: ${({ isActive, theme }) =>
    isActive ? theme.sidebar.menuTextActive : theme.sidebar.menuText};
`;

interface LinkProps {
  isActive?: boolean;
  isExpanded?: boolean;
}

const Link = styled('div')<LinkProps>`
  position: relative;
  width: 100%;
  min-height: 46px;
  box-sizing: border-box;
  padding: 15.5px 0 15.5px 24px;
  cursor: pointer;
  text-decoration: none;
  background-color: ${({ isExpanded, isActive, theme }) =>
    isExpanded && isActive ? theme.sidebar.menuBgActive : 'transparent'};

  > a {
    display: flex;
    align-items: center;
    text-decoration: none;
  }

  :hover ${LinkIcon} {
    color: ${({ theme }) => theme.sidebar.menuIconActive};
  }

  :hover ${LinkText} {
    color: ${({ theme }) => theme.sidebar.menuTextActive};
  }

  ${({ isActive, isExpanded, theme }) =>
    isExpanded &&
    isActive &&
    css`
      ::before {
        position: absolute;
        right: 0;
        top: -25px;
        width: 25px;
        height: 25px;
        font-size: 25px;
        line-height: 25px;
        content: '';
        border-bottom-right-radius: 10px;
        box-shadow: 0 7px 0 0 ${theme.sidebar.menuBgActive};
        background-color: ${theme.sidebar.background};
      }

      ::after {
        position: absolute;
        right: 0;
        bottom: -25px;
        width: 25px;
        height: 25px;
        font-size: 25px;
        line-height: 25px;
        content: '';
        border-top-right-radius: 10px;
        box-shadow: 0 -7px 0 0 ${theme.sidebar.menuBgActive};
        background-color: ${theme.sidebar.background};
      }
    `};
`;

const SubLinkText = styled(Text.h5)<LinkProps>`
  height: 15px;
  line-height: 15px;
  padding: 15px 0 0 24px;

  > a {
    text-decoration: none;
    color: ${({ isActive, theme }) =>
      isActive ? theme.sidebar.menuTextActive : theme.sidebar.menuText};

    :hover {
      color: ${({ theme }) => theme.sidebar.menuTextActive};
    }
  }
`;

const BottomActions = styled.div`
  position: absolute;
  width: 46px;
  margin: 0 7px 20px;
  bottom: 0;
`;

const BottomButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 46px;
  height: 46px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
`;

const Icon = styled(IconComponent)`
  color: ${({ theme }) => theme.sidebar.menuIcon};
`;

export default {
  Nav,
  Logo,
  Expand: {
    Button: ExpandButton,
    Icon: ExpandIcon
  },
  Link,
  SubLinkText,
  LinkIcon,
  LinkText,
  Footer,
  Bottom: {
    Actions: BottomActions,
    Button: BottomButton
  },
  Icon
};
