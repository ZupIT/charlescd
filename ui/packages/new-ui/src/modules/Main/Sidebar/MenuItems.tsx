import React, { useRef, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import startsWith from 'lodash/startsWith';
import useOutsideClick from 'core/hooks/useClickOutside';
import { getExpandMode } from 'core/utils/sidebar';
import { SubLink, Link, ExpandClick } from './Types';
import { getActiveMenuId, getExpandIcon } from './helpers';
import { menuItems } from '../constants';
import Styled from './styled';

interface Props {
  isExpanded: boolean;
  expandMenu: (state: ExpandClick) => void;
}

const MenuItems = ({ isExpanded, expandMenu }: Props) => {
  const subMenuRef = useRef<HTMLDivElement>();
  const [focused, setFocused] = useState('');
  const activeMenuId = getActiveMenuId();
  const isActive = (id: string) => startsWith(activeMenuId, id);

  useOutsideClick(subMenuRef, () => {
    setFocused('');
    expandMenu({ status: getExpandMode(), persist: false });
  });

  const onClickExpandSubMenu = (link: Link) => {
    if (!isExpanded && !isEmpty(link?.subItems)) {
      expandMenu({ status: true, persist: false });
    }

    setFocused(link.id);
  };
  const displaySubItems = ({ id, subItems }: Link) =>
    isExpanded && !isEmpty(subItems) && (isActive(id) || focused === id);

  const renderSubItems = (subItems: SubLink[]) =>
    map(subItems, subItem => (
      <Styled.SubLinkText
        key={subItem.id}
        data-testid={subItem.id}
        isActive={activeMenuId === subItem.id}
      >
        <a href={subItem.to}>{subItem.text}</a>
      </Styled.SubLinkText>
    ));

  return (
    <div data-testid="sidebar-links" ref={subMenuRef}>
      <Styled.Expand.Button
        data-testid="sidebar-expand-button"
        onClick={() => expandMenu({ persist: true })}
      >
        <Styled.Expand.Icon name={getExpandIcon(getExpandMode())} size="15px" />
      </Styled.Expand.Button>
      {map(menuItems, link => (
        <Styled.Link
          key={link.icon}
          data-testid={link.id}
          isActive={isActive(link.id)}
          isExpanded={isExpanded}
          onClick={() => onClickExpandSubMenu(link)}
        >
          <a href={link.to}>
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
          </a>
          {displaySubItems(link) && renderSubItems(link.subItems)}
        </Styled.Link>
      ))}
    </div>
  );
};

export default MenuItems;
