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

import React, { useState, useRef } from 'react';
import Icon from 'core/components/Icon';
import Text from 'core/components/Text';
import useOutsideClick from 'core/hooks/useClickOutside';
import Styled from './styled';

export const CHARLES_DOC = 'https://docs.charlescd.io';

export interface Props {
  icon: string;
  title: string;
  size?: string;
  description: string;
  link?: string;
  linkLabel?: string;
  className?: string;
}

const Popover = ({
  icon,
  title,
  size = '24px',
  link = CHARLES_DOC,
  linkLabel,
  description,
  className
}: Props) => {
  const [toggle, switchToggle] = useState(false);
  const ref = useRef<HTMLDivElement>();

  useOutsideClick(ref, () => {
    switchToggle(false);
  });

  return (
    <Styled.Wrapper ref={ref} className={className}>
      <Icon
        name={icon}
        color="dark"
        size={size}
        onClick={() => switchToggle(!toggle)}
      />
      {toggle && (
        <Styled.Popover data-testid={`popover-${title}`}>
          <Text.h4 color="light">{title}</Text.h4>
          <Styled.Content>
            <Text.h5 color="dark">{description}</Text.h5>
          </Styled.Content>
          {link && (
            <Styled.Link href={link} target="_blank">
              <Text.h6 color="light">{linkLabel}</Text.h6>
            </Styled.Link>
          )}
        </Styled.Popover>
      )}
    </Styled.Wrapper>
  );
};

export default Popover;
