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

import React from 'react';
import { Link as ComponentLink, LinkProps } from 'react-router-dom';
import styled, { css } from 'styled-components';
import IconComponent, { Props as IconProps } from 'core/components/Icon';
import ComponentDropdown from 'core/components/Dropdown';
import Text from 'core/components/Text';

const Dropdown = styled(ComponentDropdown)`
  top: -20px;
  left: 30px;
  width: 183px;
  height: fit-content;
  max-height: 100px;
`;

const DropdownItem = styled(ComponentDropdown.Item)`
  padding: 10px;
  margin-left: 22px;

  > i {
    margin-left: -22px;
  }
`;

const Nav = styled.nav`
  position: relative;
  grid-area: nav;
  background-color: ${({ theme }) => theme.sidebar.background};
`;

const Item = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 15.5px 0 0 24px;

  > :first-child {
    margin-left: 0px;
  }

  > * + * {
    margin-left: 5px;
  }
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

interface LinkIconProps {
  isActive?: boolean;
}

const LinkIcon = styled((props: IconProps) => <IconComponent {...props} />)<
  LinkIconProps
>`
  margin-right: 10px;
  color: ${({ isActive, theme }) =>
    isActive ? theme.sidebar.menuIconActive : theme.sidebar.menuIcon};
`;

interface TextProps {
  isActive?: boolean;
}

const LinkText = styled(Text.h5)<TextProps>`
  color: ${({ isActive, theme }) =>
    isActive ? theme.sidebar.menuTextActive : theme.sidebar.menuText};
`;

interface LinkCustomProps extends LinkProps {
  isActive?: boolean;
  isExpanded?: boolean;
  isDisabled?: boolean;
}

const Link = styled((props: LinkCustomProps) => {
  const devProps = { ...props };
  delete devProps.isActive;
  delete devProps.isExpanded;
  delete devProps.isDisabled;

  return <ComponentLink {...devProps} />;
})<LinkCustomProps>`
  position: relative;
  width: 100%;
  min-height: 46px;
  box-sizing: border-box;
  padding: 15.5px 0 15.5px 24px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  text-decoration: none;
  align-items: center;
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

const Bottom = styled.div`
  position: absolute;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 7px 20px 10px;
`;

export default {
  Nav,
  Logo,
  Expand: {
    Button: ExpandButton,
    Icon: ExpandIcon
  },
  Dropdown,
  DropdownItem,
  Link,
  LinkIcon,
  LinkText,
  Bottom,
  Footer,
  Item
};
