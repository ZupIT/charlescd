import React, { useState, useRef, MouseEvent, ReactNode } from 'react';
import { usePopper } from 'react-popper';
import useOutsideClick from 'core/hooks/useClickOutside';
import Icon from 'core/components/Icon';
import Item from './Item';
import Styled from './styled';

type Props = {
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
  className
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
            element: arrowRef
          }
        },
        {
          name: 'offset',
          options: {
            offset: [0, 10]
          }
        }
      ]
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
    <div data-testid="dropdown">
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
    </div>
  );
};

Dropdown.Item = Item;

export default Dropdown;
