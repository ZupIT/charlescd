import React, { useState } from 'react';
import Styled from './styled';
import { Props as InputProps } from '../Input';
import debounce from 'lodash/debounce';

interface Props extends InputProps {
  onSearch: (value: string) => void;
}

const SearchInput = ({
  name = 'search',
  className,
  onSearch,
  ...rest
}: Props) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = debounce(onSearch, 500);

  const onFocus = () => setIsFocused(true);

  const onBlur = () => setIsFocused(false);

  return (
    <Styled.Wrapper className={className}>
      <label htmlFor="inputSearch">
        <Styled.Icon name="search" isFocused={isFocused} />
      </label>
      <Styled.Input
        {...rest}
        name={name}
        id="inputSearch"
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={event => handleChange(event.currentTarget.value)}
      />
    </Styled.Wrapper>
  );
};

export default SearchInput;
