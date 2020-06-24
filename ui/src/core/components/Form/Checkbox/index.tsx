import React, { ChangeEvent } from 'react';
import Styled from './styled';

type Props = {
  className?: string;
  checked?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

const Checkbox = ({ className, checked, onChange }: Props) => (
  <Styled.CheckboxContainer className={className}>
    <Styled.HiddenCheckbox checked={checked} onChange={onChange} />
    <Styled.Checkbox checked={checked}>
      <Styled.Icon viewBox="0 0 24 24">
        <polyline points="20 6 9 17 4 12" />
      </Styled.Icon>
    </Styled.Checkbox>
  </Styled.CheckboxContainer>
);

export default Checkbox;
