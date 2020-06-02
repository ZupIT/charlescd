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

import React, { useState } from 'react';
import debounce from 'lodash/debounce';
import { Props as InputProps } from '../Input';
import Styled from './styled';

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
