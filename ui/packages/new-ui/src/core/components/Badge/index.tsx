import React from 'react';
import Text from 'core/components/Text';
import Styled from './styled';

export interface Props {
  label: string;
}

const Badge = ({ label }: Props) => (
  <Styled.Badge>
    <Text.h6 color="light" align="center">
      {label}
    </Text.h6>
  </Styled.Badge>
);

export default Badge;
