import React, { useEffect, useState } from 'react';
import { ReactSVG } from 'react-svg';
import { dynamicImport } from 'core/components/Icon/helpers';
import Styled from './styled';

export interface Props {
  name: string;
  size?: string;
  color?: string;
  className?: string;
}

const Icon = ({ name, color, size, className }: Props) => {
  const [uri, setUri] = useState('');

  useEffect(() => {
    dynamicImport(name, setUri);
  }, [name, setUri]);

  return (
    <Styled.Wrapper
      data-testid={`icon-${name}`}
      className={className}
      color={color}
      size={size}
    >
      {uri ? <ReactSVG src={uri} /> : ''}
    </Styled.Wrapper>
  );
};

export default Icon;
