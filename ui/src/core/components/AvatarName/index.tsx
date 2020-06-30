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
import Styled from './styled';
import { getNameInitials } from './helper';

export interface Props {
  src: string;
  name?: string;
  initials?: string;
  className?: string;
  size?: string;
  alt?: string;
}

const AvatarName = ({
  src,
  name,
  initials,
  className,
  size = '40px',
  alt
}: Props) => {
  const [error, setError] = useState(false);
  if (error) {
    return (
      <Styled.Wrapper className={`${className} avatar-initials`} size={size}>
        {initials || getNameInitials(name)}
      </Styled.Wrapper>
    );
  } else {
    return (
      <Styled.Image
        className={className}
        size={size}
        alt={alt || ''}
        src={src}
        onError={() => setError(true)}
      />
    );
  }
};

export default AvatarName;
