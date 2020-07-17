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

import React, { useRef } from 'react';
import map from 'lodash/map';
import startsWith from 'lodash/startsWith';
import useOutsideClick from 'core/hooks/useClickOutside';
import { getExpandMode } from 'core/utils/sidebar';
import { getActiveMenuId } from 'core/utils/menu';
import Can from 'core/components/Can';
import { Link as LinkProps, ExpandClick } from './Types';
import { getExpandIcon, getItems } from './helpers';
import Styled from './styled';

interface Props {
  isExpanded: boolean;
  expandMenu: (state: ExpandClick) => void;
}

const MenuItems = ({ isExpanded, expandMenu }: Props) => {
  const subMenuRef = useRef<HTMLDivElement>();
  const activeMenuId = getActiveMenuId();
  const isActive = (id: string) => startsWith(activeMenuId, id);

  useOutsideClick(subMenuRef, () => {
    expandMenu({ status: getExpandMode(), persist: false });
  });

  const handleClickExpand = () => {
    if (!isExpanded) {
      expandMenu({ status: true, persist: false });
    }
  };

  const renderLink = (link: LinkProps) => (
    <Styled.Link
      key={link.id}
      data-testid={link.id}
      to={link.to}
      isActive={isActive(link.id)}
      isExpanded={isExpanded}
      onClick={() => handleClickExpand()}
    >
      <Styled.LinkIcon
        name={link.icon}
        size="15px"
        isActive={isActive(link.id)}
      />
      {isExpanded && (
        <Styled.LinkText isActive={isActive(link.id)}>
          {link.text}
        </Styled.LinkText>
      )}
    </Styled.Link>
  );

  const renderProtectedLink = (link: LinkProps) => (
    <Can key={link.icon} I={link.action} a={link.subject} passThrough>
      {renderLink(link)}
    </Can>
  );

  return (
    <div data-testid="sidebar-links" ref={subMenuRef}>
      <Styled.Expand.Button
        data-testid="sidebar-expand-button"
        onClick={() => expandMenu({ persist: true })}
      >
        <Styled.Expand.Icon name={getExpandIcon(getExpandMode())} size="15px" />
      </Styled.Expand.Button>
      {map(getItems(), (link: LinkProps) =>
        link.action ? renderProtectedLink(link) : renderLink(link)
      )}
    </div>
  );
};

export default MenuItems;
