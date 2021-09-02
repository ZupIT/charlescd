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
import { useState, useRef, MouseEvent, ReactNode } from 'react';
import { usePopper } from 'react-popper';
import useOutsideClick from 'core/hooks/useClickOutside';
import Icon from 'core/components/Icon';
import Item from './DropdownItem';
import Styled from './styled';

export type Props = {
  children: ReactNode;
  icon?: string;
  color?: 'primary' | 'dark' | 'error' | 'light' | 'medium' | 'success';
  className?: string;
  size?: string;
};

const Dropdown = ({
  children,
  icon = 'vertical-dots',
  color = 'dark',
  size = '15px',
  className,
}: Props) => {
  const [showPopper, setShowPopper] = useState(false);

  const buttonRef = useRef(null);
  const popperRef = useRef(null);
  const [arrowRef, setArrowRef] = useState(null);

  useOutsideClick(buttonRef, () => {
    setShowPopper(false);
  });

  const { styles, attributes } = usePopper(
    buttonRef.current,
    popperRef.current,
    {
      strategy: 'fixed',
      modifiers: [
        {
          name: 'arrow',
          options: {
            element: arrowRef,
          },
        },
        {
          name: 'offset',
          options: {
            offset: [0, 10],
          },
        },
      ],
    }
  );

  const renderItems = () => (
    <Styled.Dropdown data-testid="dropdown-actions" className={className}>
      {children}
    </Styled.Dropdown>
  );

  const handleClick = (event: MouseEvent) => {
    event.stopPropagation();
    setShowPopper(!showPopper);
  };

  return (
    <Styled.Wrapper data-testid="dropdown">
      <Icon
        ref={buttonRef}
        name={icon}
        color={color}
        size={size}
        className="dropdown-icon"
        onClick={(event: MouseEvent) => handleClick(event)}
      />
      {showPopper ? (
        <Styled.PopperContainer
          ref={popperRef}
          style={styles.popper}
          {...attributes.popper}
        >
          <div ref={setArrowRef} style={styles.arrow} id="arrow" />
          {renderItems()}
        </Styled.PopperContainer>
      ) : null}
    </Styled.Wrapper>
  );
};

Dropdown.Item = Item;

export default Dropdown;
